const state = {
  currentSideBarComponent: null,
  currentActiveContribution: null
};

const types = {
  SET_SIDEBAR: "SET_SIDEBAR",
  SET_CONTRIBUTION: "SET_CONTRIBUTION"
};

const actions = {
  setSidebarComponent({ commit }, componentName) {
    commit(types.SET_SIDEBAR, componentName);
  },

  resetCurrentSideBar({ commit }) {
    commit(types.SET_SIDEBAR, "");
  },

  setActiveContribution({ commit }, activeContributionId) {
    commit(types.SET_CONTRIBUTION, activeContributionId);
  }
};

const mutations = {
  [types.SET_SIDEBAR](state, value) {
    state.currentSideBarComponent = value;
  },

  [types.SET_CONTRIBUTION](state, value) {
    state.currentActiveContribution = value;
  }
};

const getters = {
  getSideBarComponent(state) {
    return state.currentSideBarComponent;
  },

  getActiveContribution(state) {
    return state.currentActiveContribution;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
