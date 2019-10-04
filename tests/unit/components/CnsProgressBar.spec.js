import { shallowMount } from "@vue/test-utils";

import cnsComponent from "@/components/CnsProgressBar";
import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

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
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket: ticket,
        cnsType: "supported"
      }
    });
    expect(target.vm.cns.supported).toBeGreaterThan(0);
    expect(target.vm.cns.bypassed).toEqual(0);
    expect(target.vm.cns.resolved).toEqual(0);
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

    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket: ticketCopy,
        cnsType: "bypassed"
      }
    });

    expect(target.vm.cns.supported).toEqual(1);
    expect(target.vm.cns.bypassed).toBeGreaterThan(0);
    expect(target.vm.cns.resolved).toEqual(0);
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

    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket: ticketCopy,
        cnsType: "bypassed"
      }
    });
    // ticket was in supported stage for 1 hour ( creation => 2nd action )
    expect(target.vm.cns.supported).toEqual(1);
    // ticket was in bypassed stage for 1 hour ( 2nd action => 3rd action )
    expect(target.vm.cns.bypassed).toEqual(1);
    // greater than 0 because an expert was assigned to next status
    expect(target.vm.cns.resolved).toBeGreaterThan(0);
    expect(target.vm.calculateTimeSuspended(ticketCopy.logs, "new", 9, 18)).toEqual(0);
    // the ticket was assigned to the client for 60 minutes when the ticket was in supported status
    expect(target.vm.calculateTimeSuspended(ticketCopy.logs, "supported", 9, 18)).toEqual(60);
    expect(target.vm.calculateTimeSuspended(ticketCopy.logs, "bypassed", 9, 18)).toEqual(0);
    expect(target.vm.calculateTimeSuspended(ticketCopy.logs, "resolved", 9, 18)).toEqual(0);
  });

  it("should parse the cns duration correctly when in supported state", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket,
        cnsType: "supported"
      }
    });
    expect(target.vm.duration).toEqual(1);
  });

  it("should parse the cns duration correctly when in bypassed state", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket,
        cnsType: "bypassed"
      }
    });
    expect(target.vm.duration).toEqual(9);
  });

  it("should parse the cns duration correctly when in resolved state", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket,
        cnsType: "resolved"
      }
    });
    expect(target.vm.duration).toEqual(18);
  });

  it("should calculate the hours between two dates correctly", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket,
        cnsType: "resolved"
      }
    });
    const date1 = "2019-09-26T13:44:44.697Z";
    const date2 = "2019-09-26T17:44:44.697Z";
    expect(target.vm.hoursBetween(date1, date2)).toEqual(4);
  });

  it("should calculate the minutes the ticket was spent in working hours correctly", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket,
        cnsType: "resolved"
      }
    });
    var date1 = "2019-09-26T15:44:44.697Z";
    var date2 = "2019-09-26T17:44:44.697Z";
    expect(target.vm.calculateWorkingMinutes(date1, date2, 9, 18)).toEqual(120);
  });
});
