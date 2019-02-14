import { createLocalVue as vueTestUtilsCreateLocalVue } from "@vue/test-utils";
import { applicationInit } from "@/application-init";

function createLocalVue(config = {}) {
  return applicationInit(vueTestUtilsCreateLocalVue(), config);
}

export { createLocalVue };
