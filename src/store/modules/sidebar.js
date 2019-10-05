const state = {
  currentActiveContribution: null
};

const types = {
  SET_CONTRIBUTION: "SET_CONTRIBUTION"
};

const actions = {
  setActiveContribution({ commit }, activeContributionId) {
    commit(types.SET_CONTRIBUTION, activeContributionId);
  }
};

const mutations = {
  [types.SET_CONTRIBUTION](state, value) {
    state.currentActiveContribution = value;
  }
};

const getters = {
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
