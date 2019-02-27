import Vue from "vue";
import { applicationInit, getApplication } from "@/application-init";

import "@/main.styl";
import "@mdi/font/css/materialdesignicons.css";

window.Application = getApplication(applicationInit(Vue));
