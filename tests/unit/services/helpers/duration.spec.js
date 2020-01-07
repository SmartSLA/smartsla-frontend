import { convertIsoDurationInDaysHoursMinutes, convertIsoDurationInHours } from "@/services/helpers/duration";

describe("Duration helper", () => {
  describe("The convertIsoDurationInDaysHoursMinutes function", () => {
    it("should return  { 0, 0, 0 } if duration is undefined", () => {
      const duration = convertIsoDurationInDaysHoursMinutes();

      expect(duration).toMatchObject({
        days: 0,
        hours: 0,
        minutes: 0
      });
    });

    it("should convert IsoDuration in { days, hours, minutes } format", () => {
      const duration = convertIsoDurationInDaysHoursMinutes("P1DT1H1M");

      expect(duration).toMatchObject({
        days: 1,
        hours: 1,
        minutes: 1
      });
    });
  });
  describe("The convertIsoDurationInHours function", () => {
    it("should return 0 if duration is undefined", () => {
      const duration = convertIsoDurationInHours(null, 8);

      expect(duration).toEqual(0);
    });

    it("should return 0 if workingHours is undefined", () => {
      const duration = convertIsoDurationInHours("P1D");

      expect(duration).toEqual(0);
    });

    it("should convert IsoDuration in hours according to working hours", () => {
      const duration = convertIsoDurationInHours("P1DT1H1M", 8);

      expect(duration).toEqual(9);
    });
  });
});
