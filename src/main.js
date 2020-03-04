import Vue from "vue";
import { applicationInit, getApplication } from "@/application-init";
import TextHighlight from "vue-text-highlight";

import "@mdi/font/css/materialdesignicons.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@/main.styl";
import "@/filters/relativeTimeFilter";
import "@/filters/calendarTimeFilter";
import "@/filters/formatDateFilter";
import "@/filters/striphtml";
import "@/filters/prettyBytesFilter";
import { humanizeHoursDurationFilter } from "@/filters/humanizeHoursDurationFilter";

Vue.component("text-highlight", TextHighlight);
Vue.filter("humanizeHoursDurationFilter", humanizeHoursDurationFilter);

window.Application = getApplication(applicationInit(Vue));
