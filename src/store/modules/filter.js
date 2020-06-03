import Vue from "vue";

function initialState() {
  return {
    filters: {}
  };
}

const types = {
  SET_FILTERS: "SET_FILTERS"
};

const actions = {
  fetchFilters: ({ commit }) => {
    return Vue.axios.listFilters().then(({ data }) => {
      commit(types.SET_FILTERS, data);
    });
  }
};

const mutations = {
  [types.SET_FILTERS](state, filters) {
    (filters || []).forEach(filter => Vue.set(state.filters, filter._id, filter));
  }
};

const getters = {
  getFilterList: state => Object.values(state.filters) || []
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
