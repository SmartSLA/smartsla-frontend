import moment from "moment-timezone";

export {
  convertIsoDurationInDaysHoursMinutes,
  convertIsoDurationInHours,
  getHoursValue,
  convertCnsValueInDaysHoursMinutes
};

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

function convertCnsValueInDaysHoursMinutes(cnsValue) {
  const d = cnsValue.elapsedMinutes / (cnsValue.workingHours * 60);
  const days = Math.floor(d);
  const hours = Math.floor((d - days) * cnsValue.workingHours);
  const minutes = Math.round(cnsValue.elapsedMinutes) % 60;

  return { days, hours, minutes };
}
