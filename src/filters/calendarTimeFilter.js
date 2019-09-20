import Vue from "vue";
import moment from "moment";

Vue.filter("calendarTimeFilter", function(value) {
  if (value) {
    return moment(String(value))
      .lang("fr")
      .calendar();
  }
});
