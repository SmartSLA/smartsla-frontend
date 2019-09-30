import Vue from "vue";

function initialState() {
  return {
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsPerPageItems: [10, 25, 50, 100]
    },
    length: 0,
    tickets: {}
  };
}

const types = {
  SET_TICKETS: "SET_TICKETS",
  SET_TICKET_LENGTH: "SET_TICKET_LENGTH",
  SET_PAGINATION: "SET_PAGINATION"
};

const actions = {
  fetchTickets: ({ commit, dispatch, state }) => {
    return Vue.axios
      .listTickets({
        limit: state.pagination.rowsPerPage,
        offset: (state.pagination.page - 1) * state.pagination.rowsPerPage
      })
      .then(response => {
        dispatch("countTickets");
        commit(types.SET_TICKETS, response.data);
      });
  },

  countTickets: ({ commit }) => {
    return Vue.axios
      .countTickets()
      .then(size => commit(types.SET_TICKET_LENGTH, size))
      .catch(err => {
        // TODO
        console.log(err);
      });
  },

  setPagination: ({ commit }, pagination) => {
    commit(types.SET_PAGINATION, pagination);
  }
};

const mutations = {
  [types.SET_TICKETS](state, tickets) {
    (tickets || []).forEach(ticket => Vue.set(state.tickets, ticket._id, ticket));
  },

  [types.SET_TICKET_LENGTH](state, length) {
    state.length = length;
  },

  [types.SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  }
};

const getters = {
  getNbOfTickets: state => Number(state.length),
  getTickets: state => Object.values(state.tickets) || [],
  getCurrentPageRequests: state => {
    return Object.values(state.tickets).slice(
      (state.pagination.page - 1) * state.pagination.rowsPerPage,
      state.pagination.page * state.pagination.rowsPerPage
    );
  },
  pagination: state => state.pagination
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
