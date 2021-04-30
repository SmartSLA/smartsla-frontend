import Vue from "vue";

function initialState() {
  return {
    filters: {},
    additionalFilters: [],
    customFilters: {}
  };
}

const types = {
  SET_FILTERS: "SET_FILTERS",
  ADD_ADDITIONAL_FILTER: "ADD_ADDITIONAL_FILTER",
  REMOVE_ADDITIONAL_FILTER: "REMOVE_ADDITIONAL_FILTER",
  RESET_ADDITIONAL_FILTER: "RESET_ADDITIONAL_FILTER",
  SET_CUSTOM_FILTERS: "SET_CUSTOM_FILTERS",
  UPDATE_CUSTOM_FILTER: "UPDATE_CUSTOM_FILTER"
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
  },

  fetchCustomFilters: ({ commit }) => {
    return Vue.axios.listCustomFilters().then(({ data }) => commit(types.SET_CUSTOM_FILTERS, data));
  },

  createCustomFilter: ({ commit }, filter) => {
    return Vue.axios.createCustomFilter(filter).then(({ data }) => {
      return commit(types.UPDATE_CUSTOM_FILTER, data);
    });
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
    const { id, name } = filter.value;
    const index = state.additionalFilters.findIndex(({ value }) => value.id === id && value.name === name);

    if (index > -1) {
      Vue.delete(state.additionalFilters, index);
    }
  },

  [types.RESET_ADDITIONAL_FILTER](state) {
    state.additionalFilters = [];
  },

  [types.SET_CUSTOM_FILTERS](state, customFiltersList) {
    (customFiltersList || []).forEach(filter => Vue.set(state.customFilters, filter._id, filter));
  },

  [types.UPDATE_CUSTOM_FILTER](state, filter) {
    const { _id } = filter;

    Vue.set(state.customFilters, _id, filter);
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
  },
  customFilters: state => Object.values(state.customFilters) || [],
  customFiltersByType: state => type =>
    Object.values(state.customFilters || []).filter(filter => filter.objectType === type),
  getCustomFilter: state => id => state.customFilters[id]
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
