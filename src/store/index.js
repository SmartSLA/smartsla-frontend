import Vue from "vue";
import Vuex from "vuex";
import ApplicationSettings from "@/services/application-settings";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import state from "./state";
import plugins from "./plugins";
import applicationConfiguration from "./modules/application-configuration";
import session from "./modules/session";
import ui from "./modules/ui";
import user from "./modules/user";
import sidebar from "./modules/sidebar";
import ticket from "./modules/ticket";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    applicationConfiguration,
    session,
    ui,
    user,
    sidebar,
    ticket
  },
  actions,
  getters,
  mutations,
  plugins,
  state,
  strict: ApplicationSettings.NODE_ENV !== "production"
});
