import Vue from "vue";
import { applicationInit, getApplication } from "@/application-init";

import "@/main.styl";

window.Application = getApplication(applicationInit(Vue));
