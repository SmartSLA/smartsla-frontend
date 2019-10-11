import Vue from "vue";
import moment from "moment";
import { applicationInit, getApplication } from "@/application-init";

import "@/main.styl";
import "@mdi/font/css/materialdesignicons.css";
import "./filters/relativeTimeFilter";
import "./filters/calendarTimeFilter";
import "./filters/formatDateFilter";
import "./filters/striphtml";

window.Application = getApplication(applicationInit(Vue));
