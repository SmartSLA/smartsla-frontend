import { computeCns, calculateTimeSuspended, calculateWorkingMinutes, hoursBetween } from "@/services/cns";

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
  logs: []
};

describe("duration calculation", () => {
  it("should compute cns correctly when issue is in supported state", () => {
    var cns = computeCns(ticket);

    expect(cns.supported).toBeGreaterThan(0);
    expect(cns.bypassed).toEqual(0);
    expect(cns.resolved).toEqual(0);
  });

  it("should compute cns correctly when issue is in bypassed state", () => {
    var ticketCopy = ticket;
    ticketCopy.logs.push({
      action: "supported",
      date: "2019-09-26T14:44:44.697Z", // 1 Hour after ticket creation
      assignedTo: {
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
    ticketCopy.logs.push({
      action: "supported",
      date: "2019-09-26T14:44:44.697Z", // 1 Hour after ticket creation
      assignedTo: {
        type: "beneficiary"
      }
    });

    // Assign ticket to an expert
    ticketCopy.logs.push({
      action: "supported",
      date: "2019-09-26T15:44:44.697Z", // 2 Hours after ticket creation
      assignedTo: {
        type: "expert"
      }
    });

    // Ticket passed to another status
    ticketCopy.logs.push({
      action: "bypassed",
      date: "2019-09-26T16:44:44.697Z", // 3 Hours after ticket creation
      assignedTo: {
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
    expect(calculateTimeSuspended(ticketCopy.logs, "new", 9, 18)).toEqual(0);
    // the ticket was assigned to the client for 60 minutes when the ticket was in supported status
    expect(calculateTimeSuspended(ticketCopy.logs, "supported", 9, 18)).toEqual(60);
    expect(calculateTimeSuspended(ticketCopy.logs, "bypassed", 9, 18)).toEqual(0);
    expect(calculateTimeSuspended(ticketCopy.logs, "resolved", 9, 18)).toEqual(0);
  });

  it("should calculate the hours between two dates correctly", () => {
    const date1 = "2019-09-26T13:44:44.697Z";
    const date2 = "2019-09-26T17:44:44.697Z";
    expect(hoursBetween(date1, date2)).toEqual(4);
  });

  it("should calculate the minutes the ticket was spent in working hours correctly", () => {
    var date1 = "2019-09-26T15:44:44.697Z";
    var date2 = "2019-09-26T17:44:44.697Z";
    expect(calculateWorkingMinutes(date1, date2, 9, 18)).toEqual(120);
  });
});
