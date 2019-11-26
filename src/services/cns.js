import moment from "moment-timezone";
import Vue from "vue";
moment.tz.setDefault("Europe/Paris");

export { computeCns, computePeriods, calculateSuspendedMinutes, calculateWorkingMinutes, hoursBetween };

/**
 * Compute Cns per status
 *
 * cns per status can be 0 if n/a
 *
 * @param ticket
 * @return {{bypassed: number, supported: number, resolved: number}}
 */
function computeCns(ticket) {
  const cns = {
    supported: 0,
    bypassed: 0,
    resolved: 0
  };
  if (ticket.software && ticket.software.software && ticket.contract) {
    const workingInterval = (ticket.contract.Engagements[ticket.software.critical] &&
      ticket.contract.Engagements[ticket.software.critical].schedule) || { start: 9, end: 18 };

    const periods = computePeriods(ticket.events, ticket.timestamps.createdAt);
    const nonBusinessHours = (ticket.contract.features && ticket.contract.features.nonBusinessHours) || false;

    cns.supported = computeTime(periods["new"], workingInterval, nonBusinessHours);
    cns.bypassed = computeTime(periods["supported"], workingInterval, nonBusinessHours);
    cns.resolved = computeTime(periods["bypassed"], workingInterval, nonBusinessHours);
    const { days, hours, minutes } = cns.bypassed;
    cns.resolved.days += days;
    cns.resolved.hours += hours;
    cns.resolved.minutes += minutes;
  }
  return cns;
}

/**
 * Transform events into periods of time per status (new, supported, ...)
 *
 * Period can be undefined if no status change matches.
 *
 * When event notify a beneficiary assignment,
 * a suspension range is created until an expert assignment occurs.
 *
 * Suspension are split between status if it overlaps 2 status.
 *
 * Any non finished period or suspension are bound to currentDate
 *
 * @param events List of ticket events
 * @param ticketStartTime ticket creation time
 * @return periods per status
 */
function computePeriods(events, ticketStartTime) {
  const periods = {};
  const currentDate = moment();
  const orderedEvents = (events && [...events]) || [];

  orderedEvents.sort((a, b) => new Date(a.timestamps.createdAt) - new Date(b.timestamps.createdAt));

  let currentStatus = "new";
  let currentSuspension;

  periods[currentStatus] = {
    start: moment(ticketStartTime),
    end: currentDate,
    suspensions: []
  };

  orderedEvents.forEach(event => {
    const eventDate = moment(event.timestamps.createdAt);

    // On status change
    if (event.status) {
      // End previous period
      periods[currentStatus].end = eventDate;

      currentStatus = event.status;

      // Create period
      periods[currentStatus] = {
        start: eventDate,
        end: currentDate,
        suspensions: []
      };

      // If suspension, split between previous and current period
      if (currentSuspension) {
        currentSuspension.end = eventDate;

        currentSuspension = {
          start: eventDate,
          end: currentDate
        };

        periods[currentStatus].suspensions.push(currentSuspension);
      }
    }

    if (event.target) {
      // If beneficiary create suspension if none
      if (event.target.type === "beneficiary") {
        if (!currentSuspension) {
          currentSuspension = {
            start: eventDate,
            end: currentDate
          };
          periods[currentStatus].suspensions.push(currentSuspension);
        }
      } else {
        // If expert, end suspension if any
        if (currentSuspension) {
          currentSuspension.end = eventDate;
          currentSuspension = undefined;
        }
      }
    }
  });

  return periods;
}

/**
 * Compute spent time per period regarding working hours, holidays and customer suspensions
 *
 * @param period
 * @param workingInterval
 * @return {Object} time spent regarding contrat
 */
function computeTime(period, workingInterval, noStop) {
  if (!period) {
    return {
      days: 0,
      hours: 0,
      minutes: 0
    };
  }

  const startDate = period.start;
  const endDate = period.end;
  let minutes = 0;

  if (noStop) {
    minutes = hoursBetween(startDate, endDate) * 60;
    return getWorkingTime(minutes, 24);
  } else {
    minutes = calculateWorkingMinutes(startDate, endDate, workingInterval.start, workingInterval.end);
    minutes -= holidaysBetween(startDate, endDate) * (workingInterval.end - workingInterval.start) * 60;
    minutes -= calculateSuspendedMinutes(period.suspensions, workingInterval.start, workingInterval.end);
    return getWorkingTime(minutes, workingInterval.end - workingInterval.start);
  }
}

function getWorkingTime(workingMinutes, hoursInDay) {
  const d = workingMinutes / (hoursInDay * 60);
  const days = Math.floor(d);
  const hours = Math.floor((d - days) * hoursInDay);
  const minutes = Math.round(workingMinutes) % 60;

  return { days, hours, minutes };
}

function hoursBetween(start, end) {
  const startDate = moment(start);
  const endDate = moment(end);
  const duration = moment.duration(endDate.diff(startDate));

  return duration.asHours();
}

/**
 * Compute the number of holyday days during the period
 *
 * @param from
 * @param to
 * @return {number} number of holyday days during the period
 */
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

/**
 * Fetches holydays
 *
 * @return array of holydays
 */
function getHolidays() {
  let holidays = [];
  holidays = require("@/assets/data/holidays.json");
  if (!holidays.length) {
    holidays = Vue.axios.listHolidays();
  }

  return holidays;
}

/**
 * Calculate working minutes for the period with office hours
 *
 * @param startingDate
 * @param endingDate
 * @param startingHour
 * @param endingHour
 * @return {number}
 */
function calculateWorkingMinutes(startingDate, endingDate, startingHour, endingHour) {
  const startWrapper = moment(startingDate);
  const endWrapper = moment(endingDate);
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

/**
 * Sums the time spent during all customers suspensions
 *
 * @param suspensions
 * @param startingHour
 * @param endHour
 * @return {number} suspended time in minutes
 */
function calculateSuspendedMinutes(suspensions, startingHour, endHour) {
  let suspendedTime = 0;

  suspensions.forEach(suspension => {
    suspendedTime += calculateWorkingMinutes(suspension.start, suspension.end, startingHour, endHour);
  });

  return suspendedTime;
}
