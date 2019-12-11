export { Cns, CnsValue };

class Cns {
  supported;
  bypassed;
  resolved;
}

class CnsValue {
  engagement;
  workingHours;
  minutes = 0;
  hours = 0;
  days = 0;

  constructor(engagement, workingHours) {
    this.engagement = engagement;
    this.workingHours = workingHours;
  }
}
