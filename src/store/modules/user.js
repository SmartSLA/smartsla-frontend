import Vue from "vue";

const state = {
  user: {
    _id: null,
    firstname: "",
    lastname: "",
    preferredEmail: ""
  }
};

const types = {
  SET_USER: "SET_USER"
};

const actions = {
  fetchUser({ commit }) {
    Vue.axios.get("ticketing/api/user").then(response => {
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

  getDisplayName(state, getters) {
    return state.user && state.user.displayName ? state.user.displayName : getters.getEmail;
  },

  getEmail(state) {
    return state.user && state.user.preferredEmail;
  },

  getPhone(state) {
    return state.user && (state.user.main_phone || (state.user.ticketing && state.user.ticketing.phone));
  },

  getType(state) {
    return state.user && state.user.ticketing && state.user.ticketing.type;
  },

  getUser(state, getters) {
    return {
      id: state.user.id,
      name: getters.getDisplayName,
      email: getters.getEmail,
      type: getters.getType
    };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
