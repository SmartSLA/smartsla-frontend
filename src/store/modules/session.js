const state = {
  jwtToken: localStorage.getItem("default_auth_token")
};

const types = {
  SET_JWT_TOKEN: "SET_JWT_TOKEN"
};

const actions = {
  setJWTToken({ commit }, token) {
    commit(types.SET_JWT_TOKEN, token);
  },

  logout({ dispatch }) {
    require("vue").default.auth.logout();
    return dispatch("resetSession");
  },

  async resetSession({ dispatch }) {
    await dispatch("user/resetUser", null, { root: true });
    return dispatch("setJWTToken", "");
  }
};

const mutations = {
  [types.SET_JWT_TOKEN](state, token) {
    state.jwtToken = token;
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
