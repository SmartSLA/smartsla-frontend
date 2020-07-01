import Vue from "vue";
import { buildIntervalQueryParams } from "@/services/helpers/dashboard";

const initialState = () => ({
  queryId: "ticketByType",
  interval: "LAST_YEAR",
  filters: buildIntervalQueryParams("LAST_YEAR"),
  data: []
});

const types = {
  SET_DATA: "SET_DATA",
  SET_FILTERS: "SET_FILTERS",
  SET_INTERVAL: "SET_INTERVAL"
};

const actions = {
  fetchData: ({ state, commit }) => {
    return Vue.axios.getDashboardData(state.queryId, state.filters).then(({ data }) => commit(types.SET_DATA, data));
  },

  updateFilter: ({ dispatch, commit }, filters) => {
    commit(types.SET_FILTERS, filters);

    dispatch("fetchData");
  },

  updateInterval: ({ dispatch, commit, state }, interval) => {
    const filters = { ...state.filter, ...buildIntervalQueryParams(interval) };

    commit(types.SET_INTERVAL, interval);

    dispatch("updateFilter", filters);
  }
};

const mutations = {
  [types.SET_DATA](state, data) {
    state.data = data;
  },

  [types.SET_FILTERS](state, filters) {
    state.filters = filters;
  },

  [types.SET_INTERVAL](state, interval) {
    state.interval = interval;
  }
};

const getters = {
  getData: state => state.data,
  getInterval: state => state.interval
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
