import { shallowMount } from "@vue/test-utils";

import cnsComponent from "@/components/CnsProgressBar";
import Vue from "vue";
import Vuetify from "vuetify";
import moment from "moment-timezone";
import { DEFAULT_TIMEZONE } from "@/constants.js";
moment.tz.setDefault(DEFAULT_TIMEZONE.value);
Vue.prototype.moment = moment;
Vue.use(Vuetify);
Vue.filter("humanizeHoursDurationFilter", () => {});

const ticket = {
  type: "anomaly",
  software: {
    software: "5d9dab9cdeed5a496dc35e35",
    critical: "critical"
  },
  timestamps: {
    updatedAt: "2019-09-27T11:28:14.223+02:00",
    createdAt: "2019-09-26T13:44:44.697+02:00"
  },
  status: "bypassed",
  createdDuringBusinessHours: true,
  contract: {
    features: {
      nonBusinessHours: false
    },
    businessHours: {
      start: 9,
      end: 18
    },
    Engagements: {
      critical: {
        engagements: [
          {
            supported: {
              businessHours: "PT1H",
              nonBusinessHours: "PT3H"
            },
            bypassed: {
              businessHours: "P1D",
              nonBusinessHours: "P2D"
            },
            resolved: {
              businessHours: "P2D",
              nonBusinessHours: "P3D"
            },
            severity: "major",
            request: "anomaly"
          }
        ]
      },
      sensible: {
        engagements: [
          {
            supported: {
              businessHours: "PT1H",
              nonBusinessHours: "PT3H"
            },
            bypassed: {
              businessHours: "P1D",
              nonBusinessHours: "P2D"
            },
            resolved: {
              businessHours: "P2D",
              nonBusinessHours: "P3D"
            },
            severity: "major",
            request: "anomaly"
          }
        ]
      },
      standard: {
        engagements: [
          {
            supported: {
              businessHours: "PT1H",
              nonBusinessHours: "PT3H"
            },
            bypassed: {
              businessHours: "P1D",
              nonBusinessHours: "P2D"
            },
            resolved: {
              businessHours: "P2D",
              nonBusinessHours: "P3D"
            },
            severity: "major",
            request: "anomaly"
          }
        ]
      }
    }
  },
  logs: []
};

var hnoTicket = Object.assign({}, ticket);
hnoTicket.createdDuringBusinessHours = false;

describe("duration calculation", () => {
  it("should parse the cns duration correctly when in supported state in HO", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket,
        cnsType: "supported"
      },
      mocks: {
        $t: key => key,
        $i18n: {
          t: () => {}
        }
      }
    });
    expect(target.vm.duration).toEqual(1);
  });

  it("should parse the cns duration correctly when in supported state in HNO", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket: hnoTicket,
        cnsType: "supported"
      },
      mocks: {
        $t: key => key,
        $i18n: {
          t: () => {}
        }
      }
    });
    expect(target.vm.duration).toEqual(3);
  });

  it("should parse the cns duration correctly when in bypassed state in HO", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket,
        cnsType: "bypassed"
      },
      mocks: {
        $t: key => key,
        $i18n: {
          t: () => {}
        }
      }
    });
    expect(target.vm.duration).toEqual(9);
  });

  it("should parse the cns duration correctly when in bypassed state in HNO", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket: hnoTicket,
        cnsType: "bypassed"
      },
      mocks: {
        $t: key => key,
        $i18n: {
          t: () => {}
        }
      }
    });
    expect(target.vm.duration).toEqual(48);
  });

  it("should parse the cns duration correctly when in resolved state in HO", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket,
        cnsType: "resolved"
      },
      mocks: {
        $t: key => key,
        $i18n: {
          t: () => {}
        }
      }
    });
    expect(target.vm.duration).toEqual(18);
  });

  it("should parse the cns duration correctly when in resolved state in HNO", () => {
    const target = shallowMount(cnsComponent, {
      propsData: {
        ticket: hnoTicket,
        cnsType: "resolved"
      },
      mocks: {
        $t: key => key,
        $i18n: {
          t: () => {}
        }
      }
    });
    expect(target.vm.duration).toEqual(72);
  });
});
