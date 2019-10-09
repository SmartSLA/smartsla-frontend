import { shallowMount } from "@vue/test-utils";

import cnsComponent from "@/components/CnsProgressBar";
import Vue from "vue";
import Vuetify from "vuetify";
import moment from "moment-timezone";

moment.tz.setDefault("Europe/Paris");
Vue.prototype.moment = moment;
Vue.use(Vuetify);

const ticket = {
  software: {
    critical: "critical"
  },
  timestamps: {
    updatedAt: "2019-09-27T11:28:14.223+02:00",
    createdAt: "2019-09-26T13:44:44.697+02:00"
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
});
