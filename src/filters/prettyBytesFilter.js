import Vue from "vue";
import pretty from "pretty-bytes";

Vue.filter("prettyBytes", value => {
  return pretty(value, { locale: true });
});
