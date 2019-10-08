import Vue from "vue";
import moment from "moment";
import { applicationInit, getApplication } from "@/application-init";

import "@/main.styl";
import "@mdi/font/css/materialdesignicons.css";
import "./filters/relativeTimeFilter";
import "./filters/calendarTimeFilter";

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("DD/MM/YYYY HH:mm");
  }
});

Vue.filter("toLocaleDateString", function(date) {
  const browserLocale = navigator.language;
  const locale = browserLocale.includes("-") ? browserLocale.split("-")[0] : browserLocale || 'en';
  if (date) {
    return moment(String(date)).locale(locale).format("llll");
  }
});

Vue.filter("striphtml", function(value) {
  var div = document.createElement("div");
  div.innerHTML = value;
  var text = div.textContent || div.innerText || "";
  return text;
});

window.Application = getApplication(applicationInit(Vue));
