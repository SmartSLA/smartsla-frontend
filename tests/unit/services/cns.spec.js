import {
  computeCns,
  computePeriods,
  calculateWorkingMinutes,
  hoursBetween,
  calculateSuspendedMinutes
} from "@/services/cns";
import moment from "moment-timezone";
import { DEFAULT_TIMEZONE } from "@/constants.js";
moment.tz.setDefault(DEFAULT_TIMEZONE.value);

const currentDate = moment("2019-09-30T18:00:00.697+02:00");
function getCurrentDate() {
  return currentDate;
}

moment.now = function() {
  return getCurrentDate();
};

const ticket = {
  createdDuringBusinessHours: true,
  software: {
    software: "5d9dab9cdeed5a496dc35e35",
    critical: "critical"
  },
  timestamps: {
    updatedAt: "2019-09-27T11:28:14.223+02:00",
    createdAt: "2019-09-26T13:44:44.697+02:00"
  },
  status: "new",
  contract: {
    timezone: "Europe/Paris",
    businessHours: {
      start: 9,
      end: 18
    },
    features: {
      nonBusinessHours: false
    },
    Engagements: {
      critical: {
        engagements: [
          {
            supported: "PT1H",
            bypassed: "P1D",
            resolved: "P2D"
          }
        ]
      },
      sensible: {
        engagements: [
          {
            supported: "PT1H",
            bypassed: "P1D",
            resolved: "P2D"
          }
        ]
      },
      standard: {
        engagements: [
          {
            supported: "PT1H",
            bypassed: "P1D",
            resolved: "P2D"
          }
        ]
      }
    }
  },
  events: []
};

let ticketCopy;

describe("CNS calculation", () => {
  beforeEach(() => {
    ticketCopy = ticket;
    ticketCopy.events = [];
  });

  describe("The computeCns function", () => {
    it("should be a valid structure ", () => {
      const { supported, bypassed, resolved } = computeCns(ticketCopy);

      expect(supported).toMatchObject({
        days: expect.any(Number),
        hours: expect.any(Number),
        minutes: expect.any(Number)
      });

      expect(bypassed).toMatchObject({
        days: expect.any(Number),
        hours: expect.any(Number),
        minutes: expect.any(Number)
      });

      expect(resolved).toMatchObject({
        days: expect.any(Number),
        hours: expect.any(Number),
        minutes: expect.any(Number)
      });
    });

    it("should compute cns correctly when issue is in supported state", () => {
      let cns = computeCns(ticketCopy);
      expect(cns.supported.days).toEqual(2);
      expect(cns.supported.hours).toEqual(4);
      expect(cns.supported.minutes).toEqual(16);
    });

    it("should compute cns correctly when issue is in bypassed state", () => {
      const createdAt = moment(ticketCopy.timestamps.createdAt)
        .clone()
        .add(3, "hours");

      ticketCopy.events.push({
        status: "supported",
        timestamps: {
          createdAt
        },
        target: {
          type: "expert"
        }
      });

      let cns = computeCns(ticketCopy);
      expect(cns.supported.days).toEqual(0);
      expect(cns.supported.hours).toEqual(3);
      expect(cns.bypassed.days).toEqual(2);
      expect(cns.resolved.days).toEqual(cns.bypassed.days);
    });

    it("should not increment counter when ticket is assigned to a client", () => {
      let createdAt = moment(ticketCopy.timestamps.createdAt)
        .clone()
        .add(2, "hours");

      ticketCopy.events.push({
        status: "supported",
        timestamps: {
          createdAt
        },
        target: {
          type: "beneficiary"
        }
      });

      // Assign ticket to an expert
      createdAt = moment(ticketCopy.timestamps.createdAt)
        .clone()
        .add(3, "hours");

      ticketCopy.events.push({
        status: "supported",
        timestamps: {
          createdAt
        },
        target: {
          type: "expert"
        }
      });

      createdAt = moment(ticketCopy.timestamps.createdAt)
        .clone()
        .add(1, "hours");
      ticketCopy.events.push({
        status: "bypassed",
        timestamps: {
          createdAt
        },
        target: {
          type: "expert"
        }
      });

      const cns = computeCns(ticketCopy);
      expect(cns.bypassed.hours).toEqual(1);
    });
  });

  describe("The hoursBetween function", () => {
    it("should calculate the hours between two dates correctly", () => {
      const date1 = "2019-09-26T13:44:44.697+02:00";
      const date2 = "2019-09-26T17:44:44.697+02:00";
      expect(hoursBetween(date1, date2)).toEqual(4);
    });
  });

  describe("The calculateWorkingMinutes function", () => {
    it("should calculate the minutes the ticket was spent in working hours correctly", () => {
      const date1 = "2019-09-26T15:44:44.697+02:00";
      const date2 = "2019-09-26T17:44:44.697+02:00";
      expect(calculateWorkingMinutes(date1, date2, 9, 18)).toEqual(120);
    });
  });

  describe("The computePeriods function", () => {
    const ticketCreationDate = "2019-09-26T13:00:00.000+02:00";

    describe("with empty events", () => {
      it("should compute new period only", () => {
        let periods = computePeriods(undefined, ticketCreationDate);

        expect(periods.new).toBeDefined();
        expect(periods.supported).toBeUndefined();
        expect(periods.bypassed).toBeUndefined();
      });

      it("should set new period start to ticket creation date", () => {
        let periods = computePeriods(undefined, ticketCreationDate);

        expect(periods.new.start).toEqual(moment(ticketCreationDate));
      });

      it("should set new period end to current date", () => {
        let periods = computePeriods(undefined, ticketCreationDate);
        // `format('X')` Convert moment object to timestamp
        expect(periods.new.end.format("X")).toEqual(currentDate.format("X"));
      });
    });

    describe("with supported status change event", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000+02:00";
      const events = [
        {
          status: "supported",
          timestamps: {
            createdAt: supportedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it("should compute new and supported periods only", () => {
        expect(periods.new).toBeDefined();
        expect(periods.supported).toBeDefined();
        expect(periods.bypassed).toBeUndefined();
      });

      it("should set new period start to ticket creation date", () => {
        expect(periods.new.start).toEqual(moment(ticketCreationDate));
      });

      it("should set new period end to supported status change date", () => {
        expect(periods.new.end).toEqual(moment(supportedStatusChange));
      });

      it("should set supported period start to supported status change date", () => {
        expect(periods.supported.start).toEqual(moment(supportedStatusChange));
      });

      it("should set supported period end to current date", () => {
        expect(periods.supported.end.format("X")).toEqual(currentDate.format("X"));
      });
    });

    describe("with supported and bypassed status changes events", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000+02:00";
      const bypassedStatusChange = "2019-09-26T16:00:00.000+02:00";

      const events = [
        {
          status: "supported",
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          status: "bypassed",
          timestamps: {
            createdAt: bypassedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it("should compute new and supported periods only", () => {
        expect(periods.new).toBeDefined();
        expect(periods.supported).toBeDefined();
        expect(periods.bypassed).toBeDefined();
      });

      it("should set new period start to ticket creation date", () => {
        expect(periods.new.start).toEqual(moment(ticketCreationDate));
      });

      it("should set new period end to supported status change date", () => {
        expect(periods.new.end).toEqual(moment(supportedStatusChange));
      });

      it("should set supported period start to supported status change date", () => {
        expect(periods.supported.start).toEqual(moment(supportedStatusChange));
      });

      it("should set supported period end to bypassed status change date", () => {
        expect(periods.supported.end).toEqual(moment(bypassedStatusChange));
      });

      it("should set bypassed period start to bypassed status change date", () => {
        expect(periods.bypassed.start).toEqual(moment(bypassedStatusChange));
      });

      it("should set bypassed period end to current date", () => {
        expect(periods.bypassed.end.format("X")).toEqual(currentDate.format("X"));
      });
    });

    describe("with supported, bypassed and resolved status changes events", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000+02:00";
      const bypassedStatusChange = "2019-09-26T16:00:00.000+02:00";
      const resolvedStatusChange = "2019-09-26T18:00:00.000+02:00";

      const events = [
        {
          status: "supported",
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          status: "bypassed",
          timestamps: {
            createdAt: bypassedStatusChange
          }
        },
        {
          status: "resolved",
          timestamps: {
            createdAt: resolvedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it("should compute new and supported periods only", () => {
        expect(periods.new).toBeDefined();
        expect(periods.supported).toBeDefined();
        expect(periods.bypassed).toBeDefined();
      });

      it("should set new period start to ticket creation date", () => {
        expect(periods.new.start).toEqual(moment(ticketCreationDate));
      });

      it("should set new period end to supported status change date", () => {
        expect(periods.new.end).toEqual(moment(supportedStatusChange));
      });

      it("should set supported period start to supported status change date", () => {
        expect(periods.supported.start).toEqual(moment(supportedStatusChange));
      });

      it("should set supported period end to bypassed status change date", () => {
        expect(periods.supported.end).toEqual(moment(bypassedStatusChange));
      });

      it("should set bypassed period start to bypassed status change date", () => {
        expect(periods.bypassed.start).toEqual(moment(bypassedStatusChange));
      });

      it("should set bypassed period end resolved status change date", () => {
        expect(periods.bypassed.end).toEqual(moment(resolvedStatusChange));
      });
    });

    describe("with supported and bypassed status changes and expert assignment events", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000+02:00";
      const expert1AssignDate = "2019-09-26T13:00:00.000+02:00";
      const expert2AssignDate = "2019-09-26T14:00:00.000+02:00";
      const bypassedStatusChange = "2019-09-26T16:00:00.000+02:00";

      const events = [
        {
          status: "supported",
          timestamps: {
            createdAt: supportedStatusChange
          },
          target: {
            type: "expert"
          }
        },
        {
          timestamps: {
            createdAt: expert1AssignDate
          },
          target: {
            type: "expert"
          }
        },
        {
          timestamps: {
            createdAt: expert2AssignDate
          },
          target: {
            type: "expert"
          }
        },
        {
          status: "bypassed",
          timestamps: {
            createdAt: bypassedStatusChange
          },
          target: {
            type: "expert"
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it("should compute new and supported and bypassed periods", () => {
        expect(periods.new).toBeDefined();
        expect(periods.supported).toBeDefined();
        expect(periods.bypassed).toBeDefined();
      });

      it("should not add suspensions", () => {
        expect(periods.new.suspensions).toBeDefined();
        expect(periods.new.suspensions.length).toEqual(0);

        expect(periods.supported.suspensions).toBeDefined();
        expect(periods.supported.suspensions.length).toEqual(0);

        expect(periods.bypassed.suspensions).toBeDefined();
        expect(periods.bypassed.suspensions.length).toEqual(0);
      });
    });

    describe("with status changes and beneficiary and expert assignments while supported events", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000+02:00";
      const beneficiaryAssignDate = "2019-09-26T13:00:00.000+02:00";
      const expertAssignDate = "2019-09-26T14:00:00.000+02:00";
      const bypassedStatusChange = "2019-09-26T16:00:00.000+02:00";

      const events = [
        {
          status: "supported",
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          timestamps: {
            createdAt: beneficiaryAssignDate
          },
          target: {
            type: "beneficiary"
          }
        },
        {
          timestamps: {
            createdAt: expertAssignDate
          },
          target: {
            type: "expert"
          }
        },
        {
          status: "bypassed",
          timestamps: {
            createdAt: bypassedStatusChange
          },
          target: {
            type: "expert"
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it("should compute new, supported and periods ", () => {
        expect(periods.new).toBeDefined();
        expect(periods.supported).toBeDefined();
        expect(periods.bypassed).toBeDefined();
      });

      it("should add suspensions for supported only", () => {
        expect(periods.new.suspensions).toBeDefined();
        expect(periods.new.suspensions.length).toEqual(0);

        expect(periods.supported.suspensions).toBeDefined();
        expect(periods.supported.suspensions.length).toEqual(1);

        expect(periods.bypassed.suspensions).toBeDefined();
        expect(periods.bypassed.suspensions.length).toEqual(0);
      });

      it("should add suspensions with beneficiary assignment date as start date", () => {
        expect(periods.supported.suspensions[0].start).toEqual(moment(beneficiaryAssignDate));
      });

      it("should add suspensions with expert assignment date as end date", () => {
        expect(periods.supported.suspensions[0].end).toEqual(moment(expertAssignDate));
      });
    });

    describe("with status changes and not ending beneficiary assignment while supported events", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000+02:00";
      const beneficiaryAssignDate = "2019-09-26T13:00:00.000+02:00";
      const bypassedStatusChange = "2019-09-26T16:00:00.000+02:00";

      const events = [
        {
          status: "supported",
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          timestamps: {
            createdAt: beneficiaryAssignDate
          },
          target: {
            type: "beneficiary"
          }
        },
        {
          status: "bypassed",
          timestamps: {
            createdAt: bypassedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it("should compute new, supported and periods ", () => {
        expect(periods.new).toBeDefined();
        expect(periods.supported).toBeDefined();
        expect(periods.bypassed).toBeDefined();
      });

      it("should add suspensions for supported and bypassed", () => {
        expect(periods.new.suspensions).toBeDefined();
        expect(periods.new.suspensions.length).toEqual(0);

        expect(periods.supported.suspensions).toBeDefined();
        expect(periods.supported.suspensions.length).toEqual(1);

        expect(periods.bypassed.suspensions).toBeDefined();
        expect(periods.bypassed.suspensions.length).toEqual(1);
      });

      it("should add supported suspensions with beneficiary assignment date as start date", () => {
        expect(periods.supported.suspensions[0].start).toEqual(moment(beneficiaryAssignDate));
      });

      it("should add supported suspensions with bypassed statuschange date as end date", () => {
        expect(periods.supported.suspensions[0].end).toEqual(moment(bypassedStatusChange));
      });

      it("should add bypassed suspensions with status change date as start date", () => {
        expect(periods.bypassed.suspensions[0].start).toEqual(moment(bypassedStatusChange));
      });

      it("should add bypassed suspensions with current date as end date", () => {
        expect(periods.bypassed.suspensions[0].end.format("X")).toEqual(moment(currentDate).format("X"));
      });
    });

    describe("with status changes and several beneficiary assignments while supported events", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000+02:00";
      const beneficiary1AssignDate = "2019-09-26T13:00:00.000+02:00";
      const expertAssignDate = "2019-09-26T14:00:00.000+02:00";
      const beneficiary2AssignDate = "2019-09-26T15:00:00.000+02:00";
      const bypassedStatusChange = "2019-09-26T16:00:00.000+02:00";

      const events = [
        {
          status: "supported",
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          timestamps: {
            createdAt: beneficiary1AssignDate
          },
          target: {
            type: "beneficiary"
          }
        },
        {
          timestamps: {
            createdAt: expertAssignDate
          },
          target: {
            type: "expert"
          }
        },
        {
          timestamps: {
            createdAt: beneficiary2AssignDate
          },
          target: {
            type: "beneficiary"
          }
        },
        {
          status: "bypassed",
          timestamps: {
            createdAt: bypassedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);
      const hnoSuspendedMinutes = calculateSuspendedMinutes(periods["supported"].suspensions, 0, 24, true);

      it("should compute new, supported and periods ", () => {
        expect(periods.new).toBeDefined();
        expect(periods.supported).toBeDefined();
        expect(periods.bypassed).toBeDefined();
      });

      it("should add suspensions for supported and bypassed", () => {
        expect(periods.new.suspensions).toBeDefined();
        expect(periods.new.suspensions.length).toEqual(0);

        expect(periods.supported.suspensions).toBeDefined();
        expect(periods.supported.suspensions.length).toEqual(2);

        expect(periods.bypassed.suspensions).toBeDefined();
        expect(periods.bypassed.suspensions.length).toEqual(1);
      });

      it("should add supported suspensions with beneficiary assignment date as start date", () => {
        expect(periods.supported.suspensions[0].start).toEqual(moment(beneficiary1AssignDate));
      });

      it("should add supported suspensions with beneficiary assignment date as start date", () => {
        expect(periods.supported.suspensions[0].end).toEqual(moment(expertAssignDate));
      });

      it("should add supported suspensions with beneficiary assignment date as start date", () => {
        expect(periods.supported.suspensions[1].start).toEqual(moment(beneficiary2AssignDate));
      });

      it("should add supported suspensions with bypassed statuschange date as end date", () => {
        expect(periods.supported.suspensions[1].end).toEqual(moment(bypassedStatusChange));
      });

      it("should add bypassed suspensions with status change date as start date", () => {
        expect(periods.bypassed.suspensions[0].start).toEqual(moment(bypassedStatusChange));
      });

      it("should add bypassed suspensions with current date as end date", () => {
        expect(periods.bypassed.suspensions[0].end.format("X")).toEqual(moment(currentDate).format("X"));
      });

      it("should calculate the suspended time correctly", () => {
        expect(hnoSuspendedMinutes).toEqual(120);
      });
    });

    describe("with status changes and several beneficiary assignments while supported events in NBH", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000+02:00";
      const beneficiary1AssignDate = "2019-09-26T13:00:00.000+02:00";
      const expertAssignDate = "2019-09-27T14:00:00.000+02:00";
      const beneficiary2AssignDate = "2019-09-27T15:00:00.000+02:00";
      const bypassedStatusChange = "2019-09-28T16:00:00.000+02:00";

      const events = [
        {
          status: "supported",
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          timestamps: {
            createdAt: beneficiary1AssignDate
          },
          target: {
            type: "beneficiary"
          }
        },
        {
          timestamps: {
            createdAt: expertAssignDate
          },
          target: {
            type: "expert"
          }
        },
        {
          timestamps: {
            createdAt: beneficiary2AssignDate
          },
          target: {
            type: "beneficiary"
          }
        },
        {
          status: "bypassed",
          timestamps: {
            createdAt: bypassedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);
      const hnoSuspendedMinutes = calculateSuspendedMinutes(periods["supported"].suspensions, 0, 24, true);

      it("should calculate the suspended time correctly in non business hour", () => {
        // It should be 2 days 2 hours = 50 hours = 3000 minutes.
        expect(hnoSuspendedMinutes).toEqual(3000);
      });
    });

    describe("with unordered event list with status changes", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000+02:00";
      const bypassedStatusChange = "2019-09-26T16:00:00.000+02:00";

      const unorderedEvents = [
        {
          status: "bypassed",
          timestamps: {
            createdAt: bypassedStatusChange
          }
        },
        {
          status: "supported",
          timestamps: {
            createdAt: supportedStatusChange
          }
        }
      ];

      const periods = computePeriods(unorderedEvents, ticketCreationDate);

      it("should compute new and supported periods only", () => {
        expect(periods.new).toBeDefined();
        expect(periods.supported).toBeDefined();
        expect(periods.bypassed).toBeDefined();
      });

      it("should set new period start to ticket creation date", () => {
        expect(periods.new.start).toEqual(moment(ticketCreationDate));
      });

      it("should set new period end to supported status change date", () => {
        expect(periods.new.end).toEqual(moment(supportedStatusChange));
      });

      it("should set supported period start to supported status change date", () => {
        expect(periods.supported.start).toEqual(moment(supportedStatusChange));
      });

      it("should set supported period end to bypassed status change date", () => {
        expect(periods.supported.end).toEqual(moment(bypassedStatusChange));
      });

      it("should set bypassed period start to bypassed status change date", () => {
        expect(periods.bypassed.start).toEqual(moment(bypassedStatusChange));
      });

      it("should set bypassed period end to current date", () => {
        expect(periods.bypassed.end.format("X")).toEqual(currentDate.format("X"));
      });
    });
  });
});
