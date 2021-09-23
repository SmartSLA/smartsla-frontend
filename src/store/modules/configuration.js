import Vue from "vue";
import { LOCALE } from "@/i18n/constants";

function initialState() {
  return {
    configurations: {},
    userLanguage: null
  };
}

const types = {
  SET_CONF: "SET_CONF",
  SET_LNG: "SET_LNG"
};

const featuresConfig = [
  {
    name: "smartsla-backend",
    keys: ["features"]
  }
];

const lngConfig = [
  {
    name: "smartsla-backend",
    keys: ["language"]
  }
];

const actions = {
  fetchConfig: ({ commit }) => {
    return Vue.axios.getConfigurations(featuresConfig).then(data => commit(types.SET_CONF, data));
  },

  setUserLanguage: ({ dispatch, rootGetters }, { lang }) => {
    const userId = rootGetters["currentUser/getId"];

    const dataLng = [
      {
        name: "smartsla-backend",
        configurations: [
          {
            name: "language",
            value: {
              defaultLanguage: lang
            }
          }
        ]
      }
    ];

    return Vue.axios.setUserLanguage(userId, dataLng).then(() => {
      dispatch("fetchUserLanguage");
      localStorage.setItem("userLanguage", lang);
    });
  },

  fetchUserLanguage: ({ commit, rootGetters }) => {
    const userId = rootGetters["currentUser/getId"];

    return Vue.axios.getUserLanguage(userId, lngConfig).then(data => {
      return commit(types.SET_LNG, data)
    });
  }
};

const mutations = {
  [types.SET_CONF](state, configurations) {
    state.configurations = configurations;
  },

  [types.SET_LNG](state, userLanguage) {
    state.userLanguage = userLanguage && userLanguage.defaultLanguage || LOCALE;
  }
};

const getters = {
  getConfiguration: state => state.configurations,
  getUserLanguage: state => state.userLanguage
};

export default {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters
};
