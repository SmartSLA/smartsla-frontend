export function humanizeHoursDurationFilter(value, isInBusinessHours) {
  const vueInstance = window.Application;
  if (value) {
    let { days, hours, minutes } = value;
    if (days) {
      if (hours) {
        return isInBusinessHours
          ? vueInstance.$i18n.t(`{days}wd {hours}wh`, value)
          : vueInstance.$i18n.t(`{days}d {hours}h`, value);
      }

      return isInBusinessHours ? vueInstance.$i18n.t(`{days}wd`, value) : vueInstance.$i18n.t(`${days}d`, value);
    }
    if (hours) {
      if (minutes) {
        return isInBusinessHours
          ? vueInstance.$i18n.t(`{hours}wh {minutes}min`, value)
          : vueInstance.$i18n.t(`{hours}h {minutes}min`, value);
      }

      return isInBusinessHours ? vueInstance.$i18n.t(`{hours}wh`, value) : vueInstance.$i18n.t(`{hours}h`, value);
    }

    if (minutes) {
      return vueInstance.$i18n.t(`{minutes}min`, value);
    }
  }

  return 0;
}
