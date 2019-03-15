const state = {
  currentSideBarComponent: null,
  currentActiveContribution: null,
  currentActiveAdminMenu: null
};

const types = {
  SET_SIDEBAR: "SET_SIDEBAR",
  SET_CONTRIBUTION: "SET_CONTRIBUTION",
  SET_ADMIN_MENU: "SET_ADMIN_MENU"
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
  },

  setActiveAdminMenu({ commit }, activeMenuName) {
    commit(types.SET_ADMIN_MENU, activeMenuName);
  },

  resetAdminMenu({ commit }) {
    commit(types.SET_ADMIN_MENU, "");
  }
};

const mutations = {
  [types.SET_SIDEBAR](state, value) {
    state.currentSideBarComponent = value;
  },

  [types.SET_CONTRIBUTION](state, value) {
    state.currentActiveContribution = value;
  },

  [types.SET_ADMIN_MENU](state, value) {
    state.currentActiveAdminMenu = value;
  }
};

const getters = {
  getSideBarComponent(state) {
    return state.currentSideBarComponent;
  },

  getActiveContribution(state) {
    return state.currentActiveContribution;
  },

  getActiveAdminMenu(state) {
    return state.currentActiveAdminMenu;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
