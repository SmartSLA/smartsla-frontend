import Vue from "vue";

function initialState() {
  return {
    clients: {},
    length: 0
  };
}

const types = {
  SET_CLIENTS: "SET_CLIENTS",
  SET_CLIENT: "SET_CLIENT",
  SET_LENGTH: "SET_LENGTH",
  REMOVE_CLIENT: "REMOVE_CLIENT"
};

const actions = {
  fetchClients: ({ commit }) => {
    return Vue.axios
      .listClients()
      .then(({ data }) => commit(types.SET_CLIENTS, data))
      .catch(console.log);
  },

  fetchClientById: ({ commit }, clientId) => {
    return Vue.axios
      .getClientById(clientId)
      .then(({ data }) => commit(types.SET_CLIENT, data))
      .catch(console.log);
  },

  createClient: ({ commit }, client) => {
    return Vue.axios.createClient(client).then(({ data }) => commit(types.SET_CLIENT, data));
  },

  updateClient: ({ dispatch }, { clientId, client }) => {
    return Vue.axios.updateClient(clientId, client).then(() => dispatch("fetchClientById", clientId));
  },

  deleteClient: ({ commit }, clientId) => {
    return Vue.axios.deleteClient(clientId).then(() => {
      commit(types.REMOVE_CLIENT, clientId);
    });
  },

  countClients: ({ commit }) => {
    return Vue.axios
      .countClients()
      .then(size => commit(types.SET_LENGTH, size))
      .catch(console.log);
  }
};

const mutations = {
  [types.SET_CLIENTS](state, clients) {
    (clients || []).forEach(client => Vue.set(state.clients, client._id, client));
  },

  [types.SET_CLIENT](state, client) {
    const { _id } = client;
    Vue.set(state.clients, _id, client);
  },

  [types.SET_LENGTH](state, length) {
    state.length = length;
  },

  [types.REMOVE_CLIENT](state, clientId) {
    Vue.delete(state.clients, clientId);
  }
};

const getters = {
  getClients: state => Object.values(state.clients) || [],
  getClientById: state => id => state.clients[id],
  getClientsCount: state => Number(state.length),
  getActiveClients: state => Object.values(state.clients).filter(client => client.active)
};

export default {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters
};
