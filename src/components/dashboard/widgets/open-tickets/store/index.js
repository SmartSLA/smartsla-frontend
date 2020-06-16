import Vue from "vue";

const initialState = () => ({
  group: "",
  queryId: "ticketByOpenClosed",
  interval: "LAST_WEEK",
  data: []
});

const types = {
  SET_DATA: "SET_DATA",
  SET_INTERVAL: "SET_INTERVAL"
};

const actions = {
  fetchData: ({ state, commit }) => {
    const filterParams = {
      group: state.group,
      queryId: state.queryId,
      interval: state.interval
    };

    return Vue.axios.getData(filterParams).then(({ data }) => commit(types.SET_DATA, data));
  },

  updateInterval: ({ dispatch, commit }, value) => {
    commit(types.SET_INTERVAL, value);
    dispatch("fetchData");
  }
};

const mutations = {
  [types.SET_DATA](state, data) {
    state.data = data;
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
