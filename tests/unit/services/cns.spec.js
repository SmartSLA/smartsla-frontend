import { computeCns, computePeriods, calculateWorkingMinutes, hoursBetween } from "@/services/cns";
import moment from "moment";

const currentDate = moment();

moment.now = function() {
  return currentDate;
};

const ticket = {
  software: {
    critical: "critical"
  },
  timestamps: {
    updatedAt: "2019-09-27T11:28:14.223Z",
    createdAt: "2019-09-26T13:44:44.697Z"
  },
  status: "bypassed",
  contract: {
    Engagements: {
      critical: {
        schedule: {
          start: 9,
          end: 18
        },
        engagements: [
          {
            supported: "PT1H",
            bypassed: "P1D",
            resolved: "P2D"
          }
        ]
      },
      sensible: {
        schedule: {
          start: 9,
          end: 18
        },
        engagements: [
          {
            supported: "PT1H",
            bypassed: "P1D",
            resolved: "P2D"
          }
        ]
      },
      standard: {
        schedule: {
          start: 9,
          end: 18
        },
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

describe("CNS calculation", () => {
  describe("The computeCns function", () => {
    it("should compute cns correctly when issue is in supported state", () => {
      var cns = computeCns(ticket);

      expect(cns.supported).toBeGreaterThan(0);
      expect(cns.bypassed).toEqual(0);
      expect(cns.resolved).toEqual(0);
    });

    it("should compute cns correctly when issue is in bypassed state", () => {
      var ticketCopy = ticket;
      ticketCopy.events.push({
        status: "supported",
        timestamps: {
          createdAt: "2019-09-26T14:44:44.697Z"
        }, // 1 Hour after ticket creation
        target: {
          type: "expert"
        }
      });

      var cns = computeCns(ticketCopy);

      expect(cns.supported).toEqual(1);
      expect(cns.bypassed).toBeGreaterThan(0);
      expect(cns.resolved).toEqual(0);
    });

    it("should not increment counter when ticket is assigned to a client", () => {
      var ticketCopy = ticket;
      ticketCopy.events.push({
        status: "supported",
        timestamps: {
          createdAt: "2019-09-26T14:44:44.697Z" // 1 Hour after ticket creation
        },
        target: {
          type: "beneficiary"
        }
      });

      // Assign ticket to an expert
      ticketCopy.events.push({
        status: "supported",
        timestamps: {
          createdAt: "2019-09-26T15:44:44.697Z"
        }, // 2 Hours after ticket creation
        target: {
          type: "expert"
        }
      });

      // Ticket passed to another status
      ticketCopy.events.push({
        status: "bypassed",
        timestamps: {
          createdAt: "2019-09-26T16:44:44.697Z"
        }, // 3 Hours after ticket creation
        target: {
          type: "expert"
        }
      });

      // ticket was in supported stage for 1 hour ( creation => 2nd action )
      const cns = computeCns(ticketCopy);

      expect(cns.supported).toEqual(1);
      // ticket was in bypassed stage for 1 hour ( 2nd action => 3rd action )
      expect(cns.bypassed).toEqual(1);
      // greater than 0 because an expert was assigned to next status
      expect(cns.resolved).toBeGreaterThan(0);
    });
  });

  describe("The hoursBetween function", () => {
    it("should calculate the hours between two dates correctly", () => {
      const date1 = "2019-09-26T13:44:44.697Z";
      const date2 = "2019-09-26T17:44:44.697Z";
      expect(hoursBetween(date1, date2)).toEqual(4);
    });
  });

  describe("The calculateWorkingMinutes function", () => {
    it("should calculate the minutes the ticket was spent in working hours correctly", () => {
      const date1 = "2019-09-26T15:44:44.697Z";
      const date2 = "2019-09-26T17:44:44.697Z";
      expect(calculateWorkingMinutes(date1, date2, 9, 18)).toEqual(120);
    });
  });

  describe("The computePeriods function", () => {
    const ticketCreationDate = "2019-09-26T13:00:00.000Z";

    describe("with empty events", () => {
      it("should compute new period only", () => {
        var periods = computePeriods(undefined, ticketCreationDate);

        expect(periods.new).toBeDefined();
        expect(periods.supported).toBeUndefined();
        expect(periods.bypassed).toBeUndefined();
      });

      it("should set new period start to ticket creation date", () => {
        var periods = computePeriods(undefined, ticketCreationDate);

        expect(periods.new.start).toEqual(moment(ticketCreationDate));
      });

      it("should set new period end to current date", () => {
        var periods = computePeriods(undefined, ticketCreationDate);

        expect(periods.new.end).toEqual(currentDate);
      });
    });

    describe("with supported status change event", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000Z";
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
        expect(periods.supported.end).toEqual(currentDate);
      });
    });

    describe("with supported and bypassed status changes events", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000Z";
      const bypassedStatusChange = "2019-09-26T16:00:00.000Z";

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
        expect(periods.bypassed.end).toEqual(currentDate);
      });
    });

    describe("with supported, bypassed and resolved status changes events", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000Z";
      const bypassedStatusChange = "2019-09-26T16:00:00.000Z";
      const resolvedStatusChange = "2019-09-26T18:00:00.000Z";

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
      const supportedStatusChange = "2019-09-26T12:00:00.000Z";
      const expert1AssignDate = "2019-09-26T13:00:00.000Z";
      const expert2AssignDate = "2019-09-26T14:00:00.000Z";
      const bypassedStatusChange = "2019-09-26T16:00:00.000Z";

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
      const supportedStatusChange = "2019-09-26T12:00:00.000Z";
      const beneficiaryAssignDate = "2019-09-26T13:00:00.000Z";
      const expertAssignDate = "2019-09-26T14:00:00.000Z";
      const bypassedStatusChange = "2019-09-26T16:00:00.000Z";

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
      const supportedStatusChange = "2019-09-26T12:00:00.000Z";
      const beneficiaryAssignDate = "2019-09-26T13:00:00.000Z";
      const bypassedStatusChange = "2019-09-26T16:00:00.000Z";

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
        expect(periods.bypassed.suspensions[0].end).toEqual(moment(currentDate));
      });
    });

    describe("with status changes and several beneficiary assignments while supported events", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000Z";
      const beneficiary1AssignDate = "2019-09-26T13:00:00.000Z";
      const expertAssignDate = "2019-09-26T14:00:00.000Z";
      const beneficiary2AssignDate = "2019-09-26T15:00:00.000Z";
      const bypassedStatusChange = "2019-09-26T16:00:00.000Z";

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
        expect(periods.bypassed.suspensions[0].end).toEqual(moment(currentDate));
      });
    });

    describe("with unordered event list with status changes", () => {
      const supportedStatusChange = "2019-09-26T12:00:00.000Z";
      const bypassedStatusChange = "2019-09-26T16:00:00.000Z";

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
        expect(periods.bypassed.end).toEqual(currentDate);
      });
    });
  });
});
