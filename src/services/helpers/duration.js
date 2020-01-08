import moment from "moment-timezone";

export { convertIsoDurationInDaysHoursMinutes, convertIsoDurationInHours, getHoursValue };

function convertIsoDurationInDaysHoursMinutes(duration) {
  const momentDuration = moment.duration(duration);
  const days = Math.trunc(momentDuration.asDays());
  const hours = momentDuration.hours();
  const minutes = momentDuration.minutes();

  return { days, hours, minutes };
}

function convertIsoDurationInHours(duration, workingHours) {
  if (!duration || !workingHours) {
    return 0;
  }
  const { days, hours } = convertIsoDurationInDaysHoursMinutes(duration);

  return getHoursValue(workingHours, days, hours);
}

function getHoursValue(workingHours, days, hours = 0, minutes = 0) {
  return days * workingHours + hours + minutes / 60;
}
