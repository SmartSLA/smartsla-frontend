import { getTicketSoftwareEngagement } from "@/services/helpers/ticket";

describe("Ticket helper", () => {
  let ticket;

  beforeEach(() => {
    ticket = {
      createdDuringBusinessHours: false,
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
          nonBusinessHours: true
        },
        Engagements: {
          critical: {
            engagements: [
              {
                request: "Information",
                severity: "Major",
                supported: {
                  businessHours: "P5D",
                  nonBusinessHours: "P5D"
                },
                bypassed: {
                  businessHours: "P10D",
                  nonBusinessHours: "P0D"
                },
                resolved: {
                  businessHours: "P20D",
                  nonBusinessHours: "P0D"
                }
              },
              {
                request: "Anomaly",
                severity: "Major",
                supported: {
                  businessHours: "PT1H",
                  nonBusinessHours: "PT2H"
                },
                bypassed: {
                  businessHours: "P1D",
                  nonBusinessHours: "P2D"
                },
                resolved: {
                  businessHours: "P2D",
                  nonBusinessHours: "P0D"
                }
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
        supported: { hours: "PT2H", businessHours: false },
        bypassed: { hours: "P2D", businessHours: false },
        resolved: { hours: "P2D", businessHours: true }
      });
    });

    it("should return nothing if no engagement found", () => {
      ticket.severity = "Minor";
      const engagement = getTicketSoftwareEngagement(ticket);

      expect(engagement).toBeUndefined();
    });
  });
});
