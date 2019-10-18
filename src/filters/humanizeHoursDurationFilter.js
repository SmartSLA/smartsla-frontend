export function humanizeHoursDurationFilter(value){
  if(value){
    let {days, hours, minutes} = value;
    return days > 0 ? `${days}J ${hours}H` : `${hours}H ${minutes}M` ;
  }
}