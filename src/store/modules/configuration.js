import Vue from "vue";

function initialState() {
  return {
    configurations: {}
  };
}

const types = {
  SET_CONF: "SET_CONF"
};

const featuresConfig = [
  {
    name: "smartsla-backend",
    keys: ["features"]
  }
];

const actions = {
  fetchConfig: ({ commit }) => {
    return Vue.axios.getConfigurations(featuresConfig).then(data => commit(types.SET_CONF, data));
  }
};

const mutations = {
  [types.SET_CONF](state, configurations) {
    state.configurations = configurations;
  }
};

const getters = {
  getConfiguration: state => state.configurations
};

export default {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters
};
