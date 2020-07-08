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
import currentUser from "./modules/currentUser";
import users from "./modules/users";
import software from "./modules/software";
import ticket from "./modules/ticket";
import client from "./modules/client";
import contract from "./modules/contract";
import contribution from "./modules/contribution";
import team from "./modules/team";
import listeners from "./listeners";
import configuration from "./modules/configuration";
import filter from "./modules/filter";

import dashboard from "./modules/dashboard";
import openTickets from "@/components/dashboard/widgets/open-tickets/store/";
import criticalityTickets from "@/components/dashboard/widgets/criticality-tickets/store/";
import counterCards from "@/components/dashboard/widgets/counter-cards/store/";
import topTenSoftware from "@/components/dashboard/widgets/software/store/";
import OpenTicketsBySoftware from "@/components/dashboard/widgets/open-tickets-software/store/";

Vue.use(Vuex);

const dashboardModules = {
  openTickets,
  criticalityTickets,
  counterCards,
  topTenSoftware,
  OpenTicketsBySoftware
};

const store = new Vuex.Store({
  modules: {
    applicationConfiguration,
    session,
    ui,
    currentUser,
    users,
    software,
    ticket,
    client,
    team,
    contract,
    contribution,
    configuration,
    filter,
    dashboard: {
      modules: {
        main: dashboard,
        ...dashboardModules
      }
    }
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
