import Vue from "vue";
import { isString, isNumber, isUndefined } from "lodash";

function initialState() {
  return {
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsPerPageItems: [10, 25, 50, 100],
      totalItems: null,
      descending: false,
      sortBy: "createdAt"
    },
    length: 0,
    tickets: {},
    search: null
  };
}

const types = {
  SET_TICKETS: "SET_TICKETS",
  SET_TICKET_LENGTH: "SET_TICKET_LENGTH",
  SET_PAGINATION: "SET_PAGINATION",
  SET_SEARCH: "SET_SEARCH"
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
  },

  setTicketsLength: ({ commit }, length) => {
    commit(types.SET_TICKET_LENGTH, length);
  },

  setSearch: ({ commit, dispatch }, search) => {
    if (!search) {
      return;
    }

    commit(types.SET_SEARCH, search);
    // set length to be able to display filtered list...
    // if not, the list is not emptied
    dispatch("setTicketsLength", 0);
  }
};

const mutations = {
  [types.SET_TICKETS](state, tickets) {
    (tickets || []).forEach(ticket => Vue.set(state.tickets, ticket._id, ticket));
  },

  [types.SET_TICKET_LENGTH](state, length) {
    state.length = length;
    Vue.set(state.pagination, "totalItems", Number(length));
  },

  [types.SET_PAGINATION](state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  },

  [types.SET_SEARCH](state, search) {
    state.search = search;
  }
};

const getters = {
  getNbOfTickets: state => Number(state.length),
  getSearch: state => state.search,
  getTickets: state => Object.values(state.tickets) || [],
  getCurrentPageRequests: state => {
    const { sortBy, descending, page, rowsPerPage } = state.pagination;
    let result = Object.values(state.tickets);

    result = result.map(request => ({
      ...request,
      authorName: request.author && request.author.name,
      softwareName: request.software && request.software.software && request.software.software.name,
      responsibleName: request.responsible && request.responsible.name,
      assignedToName: request.assignedTo && request.assignedTo.name,
      id_ossa: request.idOssa.id,
      clientContract: request.contract && request.contract.client + request.contract.name,
      organizationLabel:
        request.assignedTo && request.assignedTo.type === "beneficiary" ? request.contract.client[0] : "L",
      createdAt: request.timestamps.createdAt,
      updatedAt: request.timestamps.updatedAt
    }));

    if (sortBy) {
      result = result.sort((a, b) => {
        const valueA = !isUndefined(a[sortBy]) ? a[sortBy] : "";
        const valueB = !isUndefined(b[sortBy]) ? b[sortBy] : "";

        if (isString(valueA) && isString(valueB)) {
          return descending
            ? valueA.localeCompare(valueB, "fr", { ignorePunctuation: true })
            : valueB.localeCompare(valueA, "fr", { ignorePunctuation: true });
        }

        if (isNumber(valueA) && isNumber(valueB)) {
          return descending ? valueB - valueA : valueA - valueB;
        }

        return descending ? b - a : a - b;
      });
    }

    return result.slice((page - 1) * rowsPerPage, page * rowsPerPage);
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
