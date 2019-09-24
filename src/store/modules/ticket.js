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
  fetchTickets: ({ commit }, options) => {
    Vue.axios
      .listTickets(options)
      .then(response => response.data || [])
      .then(tickets => {
        tickets.forEach(ticket => commit(types.ADD_TICKET, ticket));
        // TODO: Set length from another action on login
        commit(types.SET_TICKET_LENGTH, tickets.length);
      })
      .catch(err => {
        // TODO
        console.log(err);
      });
  },

  countTickets: ({ commit }) => {
    Vue.axios
      // TODO: Implement API backend to count tickets
      .listTickets()
      .then(response => response.data || [])
      .then(tickets => {
        commit(types.SET_TICKET_LENGTH, tickets.length);
      })
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
