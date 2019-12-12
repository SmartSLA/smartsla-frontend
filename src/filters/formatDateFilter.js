import Vue from "vue";
import moment from "moment";
import { LOCALE } from "@/i18n/constants";

Vue.filter("formatDateFilter", function(date, format) {
  format = format ? format : "ll";
  if (date) {
    return moment(String(date))
      .locale(LOCALE)
      .format(format);
  }
});
