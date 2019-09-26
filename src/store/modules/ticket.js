import Vue from "vue";

function initialState() {
  return {
    length: 0,
    tickets: {}
  };
}

const types = {
  ADD_TICKET: "ADD_TICKET",
  SET_TICKET_LENGTH: "SET_TICKET_LENGTH"
};

const actions = {
  fetchTickets: ({ commit, dispatch }, options) => {
    Vue.axios
      .listTickets(options)
      .then(response => {
        (response.data || []).forEach(ticket => commit(types.ADD_TICKET, ticket));
        dispatch("ticket/countTickets");
      })
      .catch(err => {
        // TODO
        console.log(err);
      });
  },

  countTickets: ({ commit }) => {
    Vue.axios
      .countTickets()
      .then(size => commit(types.SET_TICKET_LENGTH, size))
      .catch(err => {
        // TODO
        console.log(err);
      });
  }
};

const mutations = {
  [types.ADD_TICKET](state, ticket) {
    Vue.set(state.tickets, ticket._id, ticket);
  },

  [types.SET_TICKET_LENGTH](state, length) {
    state.length = length;
  }
};

const getters = {
  getNbOfTickets: state => state.length,
  getTickets: state => Object.values(state.tickets) || []
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
