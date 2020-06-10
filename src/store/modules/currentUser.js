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
  fetchUser({ commit, dispatch }) {
    Vue.axios
      .getCurrentTicketingUser()
      .then(response => {
        commit(types.SET_USER, response.data);
        dispatch("configuration/fetchConfig", null, { root: true });
      })
      .catch(() => {});
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

  getContracts(state) {
    return (state.user && state.user.contracts) || [];
  },

  getDisplayName(state, getters) {
    return state.user && state.user.displayName ? state.user.displayName : getters.getEmail;
  },

  getEmail(state) {
    return state.user && state.user.preferredEmail;
  },

  getId(state) {
    return state.user && state.user.id;
  },

  getPhone(state) {
    return state.user && (state.user.main_phone || (state.user.ticketing && state.user.ticketing.phone));
  },

  getType(state) {
    return state.user && state.user.ticketing && state.user.ticketing.type;
  },

  getUser(state, getters) {
    return {
      id: getters.getId,
      name: getters.getDisplayName,
      email: getters.getEmail,
      type: getters.getType,
      image: getters.getAvatarUrl,
      phone: getters.getPhone
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
