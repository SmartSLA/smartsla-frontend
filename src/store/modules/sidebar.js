const state = {
  currentSideBarComponent: null
};

const types = {
  SET_SIDEBAR: "SET_SIDEBAR"
};

const actions = {
  setSidebarComponent({ commit }, componentName) {
    commit(types.SET_SIDEBAR, componentName);
  },

  resetCurrentSideBar({ commit }) {
    commit(types.SET_SIDEBAR, "");
  }
};

const mutations = {
  [types.SET_SIDEBAR](state, value) {
    state.currentSideBarComponent = value;
  }
};

const getters = {
  getSideBarComponent(state) {
    return state.currentSideBarComponent;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
