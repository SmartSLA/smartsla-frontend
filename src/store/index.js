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
import software from "./modules/software";
import ticket from "./modules/ticket";
import client from "./modules/client";
import contract from "./modules/contract";
import contribution from "./modules/contribution";
import listeners from "./listeners";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    applicationConfiguration,
    session,
    ui,
    user,
    software,
    ticket,
    client,
    contract,
    contribution
  },
  actions,
  getters,
  mutations,
  plugins,
  state,
  strict: ApplicationSettings.NODE_ENV !== "production"
});

listeners.configure(store);

export default store;
