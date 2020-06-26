import Vue from "vue";
import moment from "moment-timezone";

Vue.filter("relativeTime", function(value, lang) {
  if (value) {
    return moment(String(value))
      .locale(lang)
      .fromNow();
  }
});
