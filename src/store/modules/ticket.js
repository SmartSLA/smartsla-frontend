import Vue from "vue";
import { isString, isNumber, isUndefined } from "lodash";
import { TICKET_DRAFT_STORAGE_KEY_PREFIX } from "@/constants";

function initialState() {
  return {
    pagination: {
      page: 1,
      rowsPerPage: 25,
      rowsPerPageItems: [10, 25, 50, { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }],
      totalItems: null,
      descending: false,
      sortBy: "updatedAt"
    },
    length: 0,
    tickets: {},
    search: null,
    filter: null
  };
}

const types = {
  SET_TICKETS: "SET_TICKETS",
  SET_TICKET_LENGTH: "SET_TICKET_LENGTH",
  SET_PAGINATION: "SET_PAGINATION",
  SET_SEARCH: "SET_SEARCH",
  UPDATE_TICKET: "UPDATE_TICKET",
  ADD_EVENT: "ADD_EVENT",
  SET_FILTER: "SET_FILTER",
  RESET_TICKETS: "RESET_TICKETS",
  SET_PAGINATION_ITEMS: "SET_PAGINATION_ITEMS"
};

const actions = {
  exportTickets: () => {
    return Vue.axios.exportTickets("csv");
  },

  fetchTickets: ({ commit, state, dispatch, rootGetters }) => {
    return Vue.axios
      .listTickets({
        limit: state.pagination.rowsPerPage === -1 ? "all" : state.pagination.rowsPerPage,
        offset: (state.pagination.page - 1) * state.pagination.rowsPerPage,
        filter: state.filter,
        a: rootGetters["filter/queryAdditionalFilters"]
      })
      .then(({ data, headers }) => {
        dispatch("countTickets");
        commit(types.SET_PAGINATION_ITEMS, headers["x-esn-items-count"]);
        commit(types.SET_TICKETS, data);
      });
  },

  fetchTicketById: ({ commit }, id) => {
    return Vue.axios.getTicketById(id).then(({ data }) => {
      commit(types.UPDATE_TICKET, data);
    });
  },

  countTickets: ({ commit }) => {
    return Vue.axios
      .countTickets()
      .then(size => commit(types.SET_TICKET_LENGTH, size))
      .catch(err => {
        // TODO
        console.log(err); // eslint-disable-line no-console
      });
  },

  saveDraft: (_, { id, ticket }) => {
    localStorage.setItem(`${TICKET_DRAFT_STORAGE_KEY_PREFIX}${id || "new"}`, JSON.stringify(ticket));
  },

  fetchDraft: (_, id) => {
    const draft = localStorage.getItem(`${TICKET_DRAFT_STORAGE_KEY_PREFIX}${id || "new"}`);

    return JSON.parse(draft);
  },

  deleteDraft: (_, id) => {
    localStorage.removeItem(`${TICKET_DRAFT_STORAGE_KEY_PREFIX}${id || "new"}`);
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
  },

  updateRelatedContributions: ({ dispatch }, { ticketId, contributions = [] }) => {
    return Vue.axios
      .updateRelatedContributions(ticketId, contributions)
      .then(() => dispatch("fetchTicketById", ticketId));
  },

  addEvent: ({ dispatch }, { ticketId, event }) => {
    return Vue.axios.addTicketEvent(ticketId, event).then(() => dispatch("fetchTicketById", ticketId));
  },

  createTicket: ({ dispatch, commit }, ticket) => {
    return Vue.axios.createTicket(ticket).then(({ data }) => {
      commit(types.UPDATE_TICKET, data);
      dispatch("countTickets");
      return data;
    });
  },

  updateTicket: ({ commit }, { ticketId, ticket }) => {
    return Vue.axios.updateTicket(ticketId, ticket).then(({ data }) => commit(types.UPDATE_TICKET, data));
  },

  setFilter: ({ commit }, filter) => {
    commit(types.SET_FILTER, filter);
    commit(types.SET_PAGINATION, { page: 1 });
  },

  resetTickets: ({ commit }) => {
    commit(types.RESET_TICKETS);
    commit(types.SET_PAGINATION, { page: 1 });
  }
};

const mutations = {
  [types.SET_TICKETS](state, tickets) {
    (tickets || []).forEach(ticket => Vue.set(state.tickets, ticket._id, ticket));
  },

  [types.SET_TICKET_LENGTH](state, length) {
    state.length = length;
  },

  [types.SET_PAGINATION_ITEMS](state, length) {
    Vue.set(state.pagination, "totalItems", Number(length));
  },

  [types.SET_PAGINATION](state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  },

  [types.SET_SEARCH](state, search) {
    state.search = search;
  },

  [types.UPDATE_TICKET](state, ticket) {
    const { _id } = ticket;
    Vue.set(state.tickets, _id, ticket);
  },

  [types.SET_FILTER](state, filter) {
    state.filter = filter;
  },

  [types.RESET_TICKETS](state) {
    state.tickets = {};
  }
};

const getters = {
  getNbOfTickets: state => Number(state.length),
  getPaginationTotalItems: state => Number(state.pagination.totalItems),
  getSearch: state => state.search,
  getTickets: state => Object.values(state.tickets) || [],
  getTicketById: state => id => {
    const ticket = (Object.values(state.tickets) || []).find(ticket => ticket._id === +id);
    if (!ticket) {
      return;
    }
    return ticket;
  },
  getCurrentPageRequests: (state, getters, rootState, rootGetters) => {
    const { sortBy, descending, page, rowsPerPage, totalItems } = state.pagination;
    let result = Object.values(state.tickets).map(request => {
      const contract = rootGetters["contract/getContractById"](request.contract);

      return {
        ...request,
        contract: contract && contract._id,
        contractName: contract && contract.name,
        clientName: contract && contract.client,
        authorName: request.author && request.author.name,
        softwareName: request.software && request.software.software && request.software.software.name,
        responsibleName: request.responsible && request.responsible.name,
        assignedToName: request.assignedTo && request.assignedTo.name,
        createdAt: request.timestamps.createdAt,
        updatedAt: request.timestamps.updatedAt,
        clientContract: contract && contract.client + contract.name
      };
    });

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

    const rowsPerPageDisplay = rowsPerPage === -1 ? totalItems : rowsPerPage;

    return result.slice((page - 1) * rowsPerPageDisplay, page * rowsPerPageDisplay);
  },
  pagination: state => state.pagination,
  filter: state => state.filter
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
