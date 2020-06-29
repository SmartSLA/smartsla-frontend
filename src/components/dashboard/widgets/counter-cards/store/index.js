import Vue from "vue";

const initialState = () => ({
  interval: "NONE",
  group: "none",
  queryId: "globalStats",
  data: []
});

const types = {
  SET_DATA: "SET_DATA"
};

const actions = {
  fetchData: ({ state, commit }) => {
    const filterParams = {
      group: state.group,
      queryId: state.queryId,
      interval: state.interval
    };

    return Vue.axios.getData(filterParams).then(({ data }) => commit(types.SET_DATA, data));
  }
};

const mutations = {
  [types.SET_DATA](state, data) {
    state.data = data;
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
