import Vue from "vue";
import moment from "moment-timezone";

Vue.filter("formatDateFilter", function(date, format, lang) {
  format = format ? format : "ll";
  if (date) {
    return moment(String(date))
      .locale(lang)
      .format(format);
  }
});
