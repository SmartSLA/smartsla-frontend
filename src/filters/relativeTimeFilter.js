import Vue from "vue";
import moment from "moment-timezone";
import { LOCALE } from "@/i18n/constants";

Vue.filter("relativeTime", function(value) {
  if (value) {
    return moment(String(value))
      .locale(LOCALE)
      .fromNow();
  }
});
