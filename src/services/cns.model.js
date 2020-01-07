import { convertIsoDurationInDaysHoursMinutes, getHoursValue } from "@/services/helpers/duration";

export { Cns, CnsValue };

class Cns {
  supported;
  bypassed;
  resolved;
}

class CnsValue {
  engagement;
  workingHours;
  isNonBusinessHours;
  minutes = 0;
  hours = 0;
  days = 0;

  constructor(engagement, workingHours, isNonBusinessHours) {
    this.engagement = engagement;
    this.workingHours = workingHours;
    this.isNonBusinessHours = isNonBusinessHours;
  }

  getPercentageElapsed() {
    const cnsInHours = getHoursValue(this.workingHours, this.days, this.hours, this.minutes);

    const engagementInHours = this.getEngagementInHours();

    if (engagementInHours) {
      return (cnsInHours / engagementInHours) * 100;
    } else {
      return 100;
    }
  }

  getEngagementInHours() {
    if (!this.engagement) {
      return 0;
    }

    const { days, hours } = convertIsoDurationInDaysHoursMinutes(this.engagement);

    return getHoursValue(this.workingHours, days, hours);
  }
}
