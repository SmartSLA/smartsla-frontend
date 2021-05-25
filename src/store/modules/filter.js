import Vue from "vue";

function initialState() {
  return {
    filters: {},
    additionalFilters: [],
    customFilters: {},
    currentCustomFilter: {}
  };
}

const types = {
  SET_FILTERS: "SET_FILTERS",
  ADD_ADDITIONAL_FILTER: "ADD_ADDITIONAL_FILTER",
  REMOVE_ADDITIONAL_FILTER: "REMOVE_ADDITIONAL_FILTER",
  RESET_ADDITIONAL_FILTER: "RESET_ADDITIONAL_FILTER",
  SET_CUSTOM_FILTERS: "SET_CUSTOM_FILTERS",
  UPDATE_CUSTOM_FILTER: "UPDATE_CUSTOM_FILTER",
  REMOVE_CUSTOM_FILTER: "REMOVE_CUSTOM_FILTER",
  SET_CURRENT_CUSTOM_FILTERS: "SET_CURRENT_CUSTOM_FILTERS",
  REMOVE_CURRENT_CUSTOM_FILTERS: "REMOVE_CURRENT_CUSTOM_FILTERS"
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
  },

  updateCustomFilter: ({ commit }, filter) => {
    const filterId = filter._id;

    return Vue.axios.updateCustomFilter(filterId, filter).then(() => {
      return commit(types.UPDATE_CUSTOM_FILTER, filter);
    });
  },

  deleteCustomFilter: ({ commit }, filterId) => {
    return Vue.axios.deleteCustomFilter(filterId).then(() => {
      return commit(types.REMOVE_CUSTOM_FILTER, filterId);
    });
  },

  setCurrentCustomFilter: ({ commit }, payload) => {
    commit(types.SET_CURRENT_CUSTOM_FILTERS, payload);
  },

  removeCurrentCustomFilter: ({ commit }, objectType) => {
    commit(types.REMOVE_CURRENT_CUSTOM_FILTERS, objectType);
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
  },

  [types.REMOVE_CUSTOM_FILTER](state, filterId) {
    Vue.delete(state.customFilters, filterId);
  },

  [types.SET_CURRENT_CUSTOM_FILTERS](state, { objectType, filter }) {
    Vue.set(state.currentCustomFilter, objectType, filter);
  },

  [types.REMOVE_CURRENT_CUSTOM_FILTERS](state, objectType) {
    Vue.delete(state.currentCustomFilter, objectType);
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
  getCustomFilter: state => id => state.customFilters[id],
  getCurrentCustomFilter: state => objectType => state.currentCustomFilter[objectType]
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
