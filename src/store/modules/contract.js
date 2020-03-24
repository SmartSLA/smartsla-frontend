import Vue from "vue";

const state = {
  contracts: {},
  contractUsers: {},
  contractTickets: {}
};

const types = {
  SET_CONTRACTS: "SET_CONTRACTS",
  NEW_CONTRACT: "NEW_CONTRACT",
  GET_CONTRACT: "GET_CONTRACT",
  SET_CONTRACT_USERS: "SET_CONTRACT_USERS",
  SET_CONTRACT_TICKETS: "SET_CONTRACT_TICKETS"
};

const actions = {
  fetchContracts: ({ commit }) => {
    return Vue.axios.getContracts().then(({ data }) => commit(types.SET_CONTRACTS, data));
  },

  fetchContractUsers: ({ commit }, contractId) => {
    return Vue.axios.getContractUsers(contractId).then(users => {
      commit(types.SET_CONTRACT_USERS, { contractId, users });
    });
  },

  fetchContractTickets: ({ commit }, contractId) => {
    return Vue.axios.getContractTicketsById(contractId).then(({ data }) => {
      commit(types.SET_CONTRACT_TICKETS, { contractId, tickets: data.list });
    });
  },

  addUsersToContract: ({ dispatch }, { contractId, users }) => {
    return Vue.axios.addUsersToContract(contractId, users).then(() => {
      dispatch("fetchContractUsers", contractId);
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
  },

  [types.SET_CONTRACT_TICKETS](state, { contractId, tickets }) {
    Vue.set(state.contractTickets, contractId, tickets);
  }
};

const getters = {
  getContracts: state => Object.values(state.contracts) || [],
  getContractById: state => id => state.contracts[id],
  activeContracts: state => (Object.values(state.contracts) || []).filter(c => c.status),
  getContractUsers: state => contractId => state.contractUsers[contractId] || [],
  getContractTickets: state => contractId => state.contractTickets[contractId] || [],
  getClients: state => (Object.values(state.contracts) || []).map(item => item.client),
  getContractsByClient: state => clientId =>
    Object.values(state.contracts || []).filter(item => item.clientId === clientId)
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
