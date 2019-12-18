import { getTicketSoftwareEngagement } from "@/services/helpers/ticket";

describe("Ticket helper", () => {
  let ticket;

  beforeEach(() => {
    ticket = {
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
      type: "Anomaly",
      severity: "Major",
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
                request: "Information",
                severity: "Major",
                supported: "P5D",
                bypassed: "P10D",
                resolved: "P20D"
              },
              {
                request: "Anomaly",
                severity: "Major",
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
  });

  describe("The getTicketSoftwareEngagement function", () => {
    it("should fetch the correct engagement", () => {
      const engagement = getTicketSoftwareEngagement(ticket);

      expect(engagement).toMatchObject({
        request: "Anomaly",
        severity: "Major",
        supported: "PT1H",
        bypassed: "P1D",
        resolved: "P2D"
      });
    });

    it("should return nothing if no engagement found", () => {
      ticket.severity = "Minor";
      const engagement = getTicketSoftwareEngagement(ticket);

      expect(engagement).toBeUndefined();
    });
  });
});
