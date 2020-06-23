import Vue from "vue";
import { buildIntervalQueryParams } from "@/services/helpers/dashboard";

const initialState = () => ({
  interval: "NONE",
  filters: buildIntervalQueryParams("NONE"),
  queryId: "globalStats",
  data: []
});

const types = {
  SET_DATA: "SET_DATA",
  SET_FILTERS: "SET_FILTERS"
};

const actions = {
  fetchData: ({ state, commit }) => {
    return Vue.axios.getDashboardData(state.queryId, state.filters).then(({ data }) => commit(types.SET_DATA, data));
  },

  updateFilter: ({ dispatch, commit }, filters) => {
    commit(types.SET_FILTERS, filters);

    dispatch("fetchData");
  }
};

const mutations = {
  [types.SET_DATA](state, data) {
    state.data = data;
  },

  [types.SET_FILTERS](state, filters) {
    state.filters = filters;
  }
};

const getters = {
  getData: state => state.data
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
