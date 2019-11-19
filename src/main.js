import Vue from "vue";
import { applicationInit, getApplication } from "@/application-init";
import JsonCsv from "vue-json-csv";
import TextHighlight from 'vue-text-highlight';

import "@/main.styl";
import "@mdi/font/css/materialdesignicons.css";
import "@/filters/relativeTimeFilter";
import "@/filters/calendarTimeFilter";
import "@/filters/formatDateFilter";
import "@/filters/striphtml";
import "@/filters/prettyBytesFilter";

Vue.component('text-highlight', TextHighlight);

window.Application = getApplication(applicationInit(Vue));
Vue.component("downloadCsv", JsonCsv);
