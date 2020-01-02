import { humanizeHoursDurationFilter } from "@/filters/humanizeHoursDurationFilter";
import { applicationInit, getApplication } from "@/application-init";
import Vue from "vue";

const duration = {
  days: 5,
  hours: 4,
  minutes: 1
};

global.window = Object.create(window);
global.window.Application = getApplication(applicationInit(Vue));

describe("The CNS humanize duration filter", () => {
  it("should print a valid humanized time when in business hours", () => {
    expect(humanizeHoursDurationFilter(duration, true)).toBe("5wd 4wh");
  });

  it("should print a valid humanized time when in non business hours", () => {
    expect(humanizeHoursDurationFilter(duration, false)).toBe("5d 4h");
  });

  it("should print a valid humanized time when no days are defined", () => {
    expect(humanizeHoursDurationFilter({ hours: duration.hours, minutes: duration.minutes }, false)).toBe("4h 1min");
  });

  it("should print a valid humanized time when no days or hours defined", () => {
    expect(humanizeHoursDurationFilter({ minutes: duration.minutes }, false)).toBe("1min");
  });

  it("should handle no value passed", () => {
    expect(humanizeHoursDurationFilter({}, false)).toEqual(0);
    expect(humanizeHoursDurationFilter(undefined, false)).toEqual(0);
    expect(humanizeHoursDurationFilter("", false)).toEqual(0);
  });
});
