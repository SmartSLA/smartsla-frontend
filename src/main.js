import Vue from "vue";
import { applicationInit, getApplication } from "@/application-init";

import "@/main.styl";
import "@mdi/font/css/materialdesignicons.css";
import "@/filters/relativeTimeFilter";
import "@/filters/calendarTimeFilter";
import "@/filters/formatDateFilter";
import "@/filters/striphtml";
import "@/filters/prettyBytesFilter";
import JsonExcel from "vue-json-excel";

window.Application = getApplication(applicationInit(Vue));
Vue.component("downloadExcel", JsonExcel);
