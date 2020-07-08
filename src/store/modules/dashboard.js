import { buildIntervalQueryParams } from "@/services/helpers/dashboard";

const initialState = () => ({
  interval: "LAST_YEAR",
  filters: {
    contracts: [],
    start: null,
    end: null
  }
});

const types = {
  SET_INTERVAL: "SET_INTERVAL",
  SET_FILTERS: "SET_FILTERS"
};

const mutations = {
  [types.SET_INTERVAL](state, interval) {
    state.interval = interval;
  },

  [types.SET_FILTERS](state, filters) {
    state.filters = filters;
  }
};

const actions = {
  setPeriod: ({ commit, state }, period) => {
    const filters = { ...state.filters, ...period, ...{ group: "month" } };

    commit(types.SET_INTERVAL, "CUSTOM_PERIOD");
    commit(types.SET_FILTERS, filters);
  },

  setInterval: ({ commit, state }, interval) => {
    const filters = { ...state.filters, ...buildIntervalQueryParams(interval) };

    commit(types.SET_INTERVAL, interval);
    commit(types.SET_FILTERS, filters);
  },

  updateFilter: ({ commit }, filters) => {
    commit(types.SET_FILTERS, filters);
  },

  updateWidgetFilters: ({ dispatch, state }) => {
    dispatch("openTickets/updateFilter", state.filters, { root: true });
    dispatch("OpenTicketsBySoftware/updateFilter", state.filters, { root: true });
    dispatch("counterCards/updateFilter", state.filters, { root: true });
    dispatch("criticalityTickets/updateFilter", state.filters, { root: true });
    dispatch("topTenSoftware/updateFilter", state.filters, { root: true });
  },

  setContracts: ({ commit, state }, contracts) => {
    const filters = { ...state.filters };

    if (contracts && contracts.length) {
      filters.contracts = contracts;
    } else {
      delete filters.contracts;
    }

    commit(types.SET_FILTERS, filters);
  }
};

const getters = {
  getInterval: state => state.interval
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
