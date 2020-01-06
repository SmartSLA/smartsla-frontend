export function humanizeHoursDurationFilter(value, isInBusinessHours) {
  const workingHourPrefix = isInBusinessHours ? "w" : "";
  const i18n = window.Application.$i18n;
  let humanizedDuration = 0;
  let durationSuffix = "";

  if (value) {
    let { days, hours, minutes } = value;
    if (days) {
      durationSuffix = hours ? ` {hours}${workingHourPrefix}h` : "";
      humanizedDuration = i18n.t(`{days}${workingHourPrefix}d${durationSuffix}`, value);
    } else if (hours) {
      durationSuffix = minutes ? ` {minutes}min` : "";
      humanizedDuration = i18n.t(`{hours}${workingHourPrefix}h${durationSuffix}`, value);
    } else if (minutes) {
      humanizedDuration = i18n.t(`{minutes}min`, value);
    }
  }

  return humanizedDuration;
}
