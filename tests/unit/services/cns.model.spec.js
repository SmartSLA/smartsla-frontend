import { CnsValue } from "@/services/cns.model";

function computeEngagment(months, days, hours) {
  return "P" + months + "M" + days + "DT" + hours + "H";
}

function checkEngagement(workingHours, months, days, hours, minutes = 0) {
  return (months * 30 + days) * workingHours + hours + minutes / 60;
}

describe("The CnsValue Object", () => {
  let cnsValue;

  describe("The getEngagementInHours method", () => {
    it("should return total duration according to the office hours", () => {
      const engagment = computeEngagment(1, 23, 3);
      const workingHours = 8;
      cnsValue = new CnsValue(engagment, workingHours);

      expect(cnsValue.getEngagementInHours()).toEqual(checkEngagement(workingHours, 1, 23, 3));
    });

    it("should return total duration according to the office hours", () => {
      const engagment = computeEngagment(1, 23, 3);
      const workingHours = 24;
      cnsValue = new CnsValue(engagment, workingHours);

      expect(cnsValue.getEngagementInHours()).toEqual(checkEngagement(workingHours, 1, 23, 3));
    });
  });

  describe("The getPercentageElapsed method", () => {
    it("should return 0 if no engagement", () => {
      const engagment = computeEngagment(1, 23, 3);
      const workingHours = 8;
      cnsValue = new CnsValue(engagment, workingHours);

      expect(cnsValue.getPercentageElapsed()).toEqual(0);
    });

    it("should compute the percentage of completion", () => {
      const engagment = computeEngagment(1, 23, 3);
      const workingHours = 24;
      cnsValue = new CnsValue(engagment, workingHours);

      cnsValue.days = 10;
      cnsValue.hours = 5;
      cnsValue.minutes = 30;

      expect(cnsValue.getPercentageElapsed()).toEqual(
        (checkEngagement(workingHours, 0, 10, 5, 30) / checkEngagement(workingHours, 1, 23, 3)) * 100
      );
    });
  });
});
