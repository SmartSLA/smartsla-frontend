import Vue from "vue";

const state = {
  contracts: {},
  contractUsers: {}
};

const types = {
  SET_CONTRACTS: "SET_CONTRACTS",
  NEW_CONTRACT: "NEW_CONTRACT",
  GET_CONTRACT: "GET_CONTRACT",
  SET_CONTRACT_USERS: "SET_CONTRACT_USERS"
};

const actions = {
  fetchContracts: ({ commit }) => {
    return Vue.axios.getContracts().then(response => commit(types.SET_CONTRACTS, response.data));
  },

  fetchContractUsers: ({ commit }, contractId) => {
    return Vue.axios.getContractUsers(contractId).then(users => {
      commit(types.SET_CONTRACT_USERS, { contractId, users });
    });
  }
};

const mutations = {
  [types.SET_CONTRACTS](state, contracts) {
    (contracts || []).forEach(contract => Vue.set(state.contracts, contract._id, contract));
  },

  [types.NEW_CONTRACT](state, contract) {
    state.contracts = [...state.contracts, contract];
  },

  [types.SET_CONTRACT_USERS](state, { contractId, users }) {
    Vue.set(state.contractUsers, contractId, users);
  }
};

const getters = {
  getContracts: state => Object.values(state.contracts) || [],
  getContractById: state => id => state.contracts[id],
  activeContracts: state => (Object.values(state.contracts) || []).filter(c => c.status),
  getContractUsers: state => contractId => state.contractUsers[contractId] || []
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
