import Vue from "vue";
import moment from "moment";

Vue.filter("relativeTime", function(value) {
  if (value) {
    return moment(String(value))
      .lang("fr")
      .fromNow();
  }
});
