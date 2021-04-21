import Vue from "vue";

function initialState() {
  return {
    filters: {},
    additionalFilters: []
  };
}

const types = {
  SET_FILTERS: "SET_FILTERS",
  ADD_ADDITIONAL_FILTER: "ADD_ADDITIONAL_FILTER",
  REMOVE_ADDITIONAL_FILTER: "REMOVE_ADDITIONAL_FILTER",
  RESET_ADDITIONAL_FILTER: "RESET_ADDITIONAL_FILTER"
};

const actions = {
  fetchFilters: ({ commit }) => {
    return Vue.axios.listFilters().then(({ data }) => {
      commit(types.SET_FILTERS, data);
    });
  },

  addAdditionalFilter: ({ commit }, filter) => {
    commit(types.ADD_ADDITIONAL_FILTER, filter);
  },

  removeAdditionalFilter: ({ commit }, filter) => {
    commit(types.REMOVE_ADDITIONAL_FILTER, filter);
  },

  resetAdditionalFilter: ({ commit }, filter) => {
    commit(types.RESET_ADDITIONAL_FILTER, filter);
  }
};

const mutations = {
  [types.SET_FILTERS](state, filters) {
    (filters || []).forEach(filter => Vue.set(state.filters, filter._id, filter));
  },

  [types.ADD_ADDITIONAL_FILTER](state, filter) {
    state.additionalFilters = [...state.additionalFilters, filter];
  },

  [types.REMOVE_ADDITIONAL_FILTER](state, filter) {
    const index = state.additionalFilters.findIndex(f => f.key === filter.key && f.value === filter.value);

    if (index > -1) {
      Vue.delete(state.additionalFilters, index);
    }
  },

  [types.RESET_ADDITIONAL_FILTER](state) {
    state.additionalFilters = [];
  }
};

const getters = {
  getFilterList: state => Object.values(state.filters) || [],
  additionalFilters: state => state.additionalFilters || [],
  queryAdditionalFilters: state => {
    const query = state.additionalFilters.reduce((filterList, { category, value }) => {
      const filterCategory = category.toLowerCase();

      if (!filterList[filterCategory]) {
        filterList[filterCategory] = [];
      }
      filterList[filterCategory].push(value);

      return filterList;
    }, {});

    return JSON.stringify(query);
  }
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
