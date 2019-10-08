import moment from "moment";
import Vue from "vue";

export { computeCns, calculateTimeSuspended, calculateWorkingMinutes, hoursBetween };

function computeCns(ticket) {
  const cns = {
    supported: 0,
    bypassed: 0,
    resolved: 0
  };
  const startDate = moment(ticket.timestamps.createdAt);
  const currentDate = moment();
  const criticalityLevel = ticket.software.critical;

  let workingInterval =
    ticket.contract.Engagements[criticalityLevel] && ticket.contract.Engagements[criticalityLevel].schedule;
  let noStop = false;

  if (workingInterval) {
    noStop = workingInterval.end === "-" || workingInterval.start === "7d/7d";
  } else {
    workingInterval = {
      start: 9,
      end: 18
    };
  }

  // Calculate time spent between creation and supported status.
  const supportedActions = ticket.logs.filter(log => log.action.toLowerCase() === "supported");
  if (supportedActions.length) {
    const firstSupportedAction = supportedActions[0];

    cns.supported = computeElapsedTimeForStatus(
      "new",
      startDate,
      firstSupportedAction.date,
      workingInterval,
      noStop,
      ticket.logs
    );

    // Calculate time spent between supported and bypassed
    const bypassedActions = ticket.logs.filter(log => log.action.toLowerCase() === "bypassed");
    if (bypassedActions.length) {
      const firstBypassedAction = bypassedActions[0];

      cns.bypassed = computeElapsedTimeForStatus(
        "supported",
        firstSupportedAction.date,
        firstBypassedAction.date,
        workingInterval,
        noStop,
        ticket.logs
      );

      // Calculate time spent between bypassed and resolved
      let resolvedActions = ticket.logs.filter(log => log.action.toLowerCase() === "resolved");
      if (resolvedActions.length) {
        let firstResolvedAction = resolvedActions[0];

        cns.resolved = computeElapsedTimeForStatus(
          "resolved",
          firstBypassedAction.date,
          firstResolvedAction.date,
          workingInterval,
          noStop,
          ticket.logs
        );
      } else {
        // Not resolved so between bypassed and now

        cns.resolved = computeElapsedTimeForStatus(
          "bypassed",
          firstBypassedAction.date,
          currentDate,
          workingInterval,
          noStop,
          ticket.logs
        );
      }
    } else {
      // Not bypassed so between supported and now

      cns.bypassed = computeElapsedTimeForStatus(
        "supported",
        firstSupportedAction.date,
        currentDate,
        workingInterval,
        noStop,
        ticket.logs
      );
    }
  } else {
    // Not supported so between creation and now
    const startsDate = moment(ticket.timestamps.createdAt);

    cns.supported = computeElapsedTimeForStatus("new", startsDate, currentDate, workingInterval, noStop, ticket.logs);
  }

  return cns;
}

function computeElapsedTimeForStatus(status, startDate, endDate, workingInterval, noStop, logs) {
  let minuteCount = 0;

  if (noStop) {
    minuteCount = hoursBetween(startDate, endDate) * 60;
  } else {
    minuteCount = calculateWorkingMinutes(startDate, endDate, workingInterval.start, workingInterval.end);
    minuteCount =
      minuteCount - holidaysBetween(startDate, endDate) * (workingInterval.end - workingInterval.start) * 60;
    minuteCount =
      minuteCount - calculateTimeSuspended(logs, status, workingInterval.start, workingInterval.end);
  }
  return +moment
    .duration({ minutes: minuteCount })
    .asHours()
    .toFixed(2);
}

function hoursBetween(start, end) {
  const startDate = moment(start);
  const endDate = moment(end);
  const duration = moment.duration(endDate.diff(startDate));

  return duration.asHours();
}

function holidaysBetween(from, to) {
  let startYear = moment(from).year();
  let endYear = moment(to).year();
  let allHolidays = getHolidays(startYear);
  if (startYear !== endYear) {
    allHolidays.concat(getHolidays(endYear));
  }

  let holidaysDates = allHolidays.map(date => moment(date));
  let holidays = holidaysDates.filter(date => {
    if (date.valueOf() <= to.valueOf() && date.valueOf() >= from.valueOf()) {
      return !(date.weekday() === 6 || date.weekday() === 0);
    } else {
      return false;
    }
  });

  return holidays.length;
}

function getHolidays() {
  let holidays = [];
  holidays = require("@/assets/data/holidays.json");
  if (!holidays.length) {
    holidays = Vue.axios.listHolidays();
  }

  return holidays;
}

function calculateWorkingMinutes(startingDate, endingDate, startingHour, endingHour) {
  var startWrapper = moment.utc(startingDate);
  const endWrapper = moment.utc(endingDate);
  let minutes = 0;
  while (startWrapper.valueOf() < endWrapper.valueOf()) {
    if (startWrapper.day() !== 0 && startWrapper.day() !== 6) {
      if (startWrapper.hour() >= startingHour && startWrapper.hour() < endingHour) {
        ++minutes;
      }
    }
    startWrapper.add(1, "minutes");
  }

  return minutes;
}

function calculateTimeSuspended(logs, actionType, startingHour, endHour) {
  let suspendedTime = 0;
  let expertActions = [];
  let nextStageActions = [];
  let nextActionDate = moment();
  let actions = logs.filter(log => log.action.toLowerCase() === actionType);
  let suspendActions = actions.filter(log => {
    const assignedTo = log.assignedTo;

    return !!(assignedTo.type && assignedTo.type === "beneficiary");
  });

  for (let i = 0; i < suspendActions.length; i++) {
    expertActions = actions.filter(
      action =>
        moment(action.date).isAfter(moment(suspendActions[i].date)) &&
        action.assignedTo &&
        action.assignedTo.type !== "beneficiary"
    );

    if (expertActions && expertActions.length) {
      for (let j = 0; j < expertActions.length; j++) {
        suspendedTime += calculateWorkingMinutes(
          moment(suspendActions[i].date),
          moment(expertActions[j].date),
          startingHour,
          endHour
        );
        break;
      }
    } else {
      nextStageActions = logs.filter(
        log => log.action !== actionType && moment(log.date).isAfter(moment(suspendActions[i].date))
      );

      if (nextStageActions && nextStageActions.length) {
        nextActionDate = moment(nextStageActions[0].date);
      } else {
        nextActionDate = moment();
      }

      suspendedTime += calculateWorkingMinutes(suspendActions[i].date, nextActionDate, startingHour, endHour);
      break;
    }
  }

  return suspendedTime;
}
