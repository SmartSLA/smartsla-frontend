import Vue from "vue";

const state = {
  snackbar: {
    color: "red",
    message: null,
    timeout: 5000
  }
};

const types = {
  SHOW_SNACKBAR: "SHOW_SNACKBAR"
};

const actions = {
  displaySnackbar({ commit }, snackbar) {
    commit(types.SHOW_SNACKBAR, snackbar);
  }
};

const mutations = {
  [types.SHOW_SNACKBAR](state, snackbar) {
    snackbar.show = true;
    Vue.set(state, "snackbar", snackbar);
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
