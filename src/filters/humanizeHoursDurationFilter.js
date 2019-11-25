export function humanizeHoursDurationFilter(value) {
  if (value) {
    let { days, hours, minutes } = value;
    return days ? `${days}J ${hours}H` : minutes ? `${hours}H ${minutes}M` : `${hours}H`;
  }
}
