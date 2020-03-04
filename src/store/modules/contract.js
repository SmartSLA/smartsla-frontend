import Vue from "vue";

const state = {
  contracts: {}
};

const types = {
  SET_CONTRACTS: "SET_CONTRACTS",
  NEW_CONTRACT: "NEW_CONTRACT",
  GET_CONTRACT: "GET_CONTRACT",
  SET_CONTRACT_SOFTWARE: "SET_CONTRACT_SOFTWARE"
};

const actions = {
  fetchContracts: ({ commit }) => {
    return Vue.axios.getContracts().then(response => commit(types.SET_CONTRACTS, response.data));
  }
};

const mutations = {
  [types.SET_CONTRACTS](state, contracts) {
    (contracts || []).forEach(contract => Vue.set(state.contracts, contract._id, contract));
  },

  [types.NEW_CONTRACT](state, contract) {
    state.contracts = [...state.contracts, contract];
  }
};

const getters = {
  getContracts: state => Object.values(state.contracts) || [],
  getContractById: state => id => state.contracts[id],
  activeContracts: state => (Object.values(state.contracts) || []).filter(c => c.status)
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
