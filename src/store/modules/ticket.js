import Vue from "vue";

function initialState() {
  return {
    length: 0,
    tickets: {}
  };
}

const types = {
  ADD_TICKET: "ADD_TICKET"
};

const actions = {
  fetchTickets: ({ commit }, options) => {
    Vue
      .$http.listTickets(options)
      .then(response => response.data || [])
      .then(tickets => {
        tickets.forEach(ticket => commit(types.ADD_TICKET, ticket));
        // TODO: LENGTH
      })
      .catch(err => {
        // TODO
        console.log(err);
      });
  }
}

const mutations = {
  [types.ADD_TICKET](state, ticket) {
    Vue.set(state.tickets, ticket.id, ticket);
  }
};

const getters = {
  getNbOfTickets: state => state.length || 10
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
