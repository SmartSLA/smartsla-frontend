import moment from "moment-timezone";
import Vue from "vue";
import { Cns, CnsValue } from "@/services/cns.model";
import { getTicketSoftwareEngagement } from "@/services/helpers/ticket";
import { DEFAULT_TIMEZONE } from "@/constants.js";
import { UNDEFINED_DURATION } from "@/constants";

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
  const cns = new Cns();

  if (ticket.software && ticket.software.software && ticket.contract) {
    const timezone = getTimeZone(ticket.contract);
    moment.tz.setDefault(timezone);
    const workingInterval = ticket.contract.businessHours || { start: 9, end: 18 };
    const periods = computePeriods(ticket.events, ticket.timestamps.createdAt);
    const nonBusinessHours = !ticket.createdDuringBusinessHours || false;
    const engagement = getTicketSoftwareEngagement(ticket) || {};

    cns.supported = computeTime(periods["new"], workingInterval, nonBusinessHours, engagement.supported);
    cns.bypassed = computeTime(periods["supported"], workingInterval, nonBusinessHours, engagement.bypassed);
    cns.resolved = computeTime(periods["bypassed"], workingInterval, nonBusinessHours, engagement.resolved);

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
 * @param useNonBusinessHours
 * @param engagement
 * @return {Object} time spent regarding contrat
 */
function computeTime(period, workingInterval, useNonBusinessHours, engagement) {
  let noStop = useNonBusinessHours;
  if (useNonBusinessHours) {
    noStop = engagement.nonBusinessHours !== UNDEFINED_DURATION;
  }

  const workingHoursInterval = noStop ? 24 : workingInterval.end - workingInterval.start;
  const cnsValue = new CnsValue(engagement, workingHoursInterval);

  if (!period) {
    return cnsValue;
  }

  const startDate = period.start;
  const endDate = period.end;
  let elapsedMinutes = 0;

  if (noStop) {
    elapsedMinutes = hoursBetween(startDate, endDate) * 60;
    elapsedMinutes -= calculateSuspendedMinutes(period.suspensions, 0, 24, true);
  } else {
    elapsedMinutes = calculateWorkingMinutes(startDate, endDate, workingInterval.start, workingInterval.end);
    elapsedMinutes -= holidaysBetween(startDate, endDate) * (workingInterval.end - workingInterval.start) * 60;
    elapsedMinutes -= calculateSuspendedMinutes(period.suspensions, workingInterval.start, workingInterval.end);
  }

  const { days, hours, minutes } = getWorkingTime(elapsedMinutes, workingHoursInterval);

  cnsValue.minutes = minutes;
  cnsValue.hours = hours;
  cnsValue.days = days;

  return cnsValue;
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
 * @param nbh 24/7 option
 * @return {number} suspended time in minutes
 */
function calculateSuspendedMinutes(suspensions, startingHour, endHour, nbh = false) {
  let suspendedTime = 0;
  if (nbh) {
    suspensions.forEach(suspension => {
      suspendedTime += hoursBetween(suspension.start, suspension.end) * 60;
    });
  } else {
    suspensions.forEach(suspension => {
      suspendedTime += calculateWorkingMinutes(suspension.start, suspension.end, startingHour, endHour);
    });
  }

  return suspendedTime;
}

/**
 * Return full timezone name for a contract otherwise return default `Europe/Paris`
 *
 * @param contract
 * @return {string} full timezone name
 */
function getTimeZone(contract) {
  const timezone = !contract.timezone ? DEFAULT_TIMEZONE.value : contract.timezone;
  return timezone;
}
