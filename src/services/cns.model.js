import moment from "moment-timezone";

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
    const cnsInHours = this.getHoursValue(this.days, this.hours, this.minutes);

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

    const engagementDuration = moment.duration(this.engagement);
    const days = Math.trunc(engagementDuration.asDays());
    const hours = engagementDuration.hours();

    return this.getHoursValue(days, hours);
  }

  getHoursValue(days, hours, minutes = 0) {
    return days * this.workingHours + hours + minutes / 60;
  }
}
