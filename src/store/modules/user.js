import Vue from "vue";

const state = {
  user: null
};

const types = {
  SET_USER: "SET_USER"
};

const actions = {
  fetchUser({ commit }) {
    Vue.axios.get("api/user").then(response => {
      commit(types.SET_USER, response.data);
    });
  },

  resetUser({ commit }) {
    commit(types.SET_USER, {});
  }
};

const mutations = {
  [types.SET_USER](state, value) {
    state.user = value;
  }
};

const getters = {
  getAvatarUrl(state, getters, rootState) {
    return (
      state.user &&
      state.user._id &&
      `${rootState.applicationConfiguration.baseUrl}/api/users/${state.user._id}/profile/avatar`
    );
  },

  getDisplayName(state) {
    return state.user && `${state.user.firstname} ${state.user.lastname}`;
  },

  getEmail(state) {
    return state.user && state.user.preferredEmail;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
