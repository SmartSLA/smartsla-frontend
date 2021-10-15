import Vue from "vue";

function initialState() {
  return {
    software: {},
    length: 0
  };
}

const types = {
  SET_SOFTWARE: "SET_SOFTWARE",
  UPDATE_SOFTWARE: "UPDATE_SOFTWARE",
  SET_LENGTH: "SET_LENGTH",
  REMOVE_SOFTWARE: "REMOVE_SOFTWARE"
};

const actions = {
  fetchSoftwareList: ({ commit, dispatch }, options = {}) => {
    return Vue.axios.listSoftware(options).then(({ data }) => {
      commit(types.SET_SOFTWARE, data);
      dispatch("countSoftware");
    });
  },

  fetchSoftwareById: ({ commit }, softwareId) => {
    return Vue.axios
      .getSoftwareById(softwareId)
      .then(({ data }) => commit(types.UPDATE_SOFTWARE, data))
      .catch(console.log); // eslint-disable-line no-console
  },

  createSoftware: ({ commit }, software) => {
    return Vue.axios.createSoftware(software).then(({ data }) => commit(types.UPDATE_SOFTWARE, data));
  },

  updateSoftware: ({ dispatch }, { softwareId, software }) => {
    return Vue.axios.updateSoftware(softwareId, software).then(() => dispatch("fetchSoftwareById", softwareId));
  },

  deleteSoftware: ({ commit }, softwareId) => {
    return Vue.axios.deleteSoftware(softwareId).then(() => commit(types.REMOVE_SOFTWARE, softwareId));
  },

  countSoftware: ({ commit }) => {
    return Vue.axios.countSoftware().then(count => commit(types.SET_LENGTH, count));
  }
};

const mutations = {
  [types.SET_SOFTWARE](state, softwareList) {
    (softwareList || []).forEach(software => Vue.set(state.software, software._id, software));
  },

  [types.UPDATE_SOFTWARE](state, software) {
    const { _id } = software;

    Vue.set(state.software, _id, software);
  },

  [types.SET_LENGTH](state, length) {
    state.length = length;
  },

  [types.REMOVE_SOFTWARE](state, softwareId) {
    Vue.delete(state.software, softwareId);
  }
};

const getters = {
  getSoftwareList: state => Object.values(state.software) || [],
  getSoftwareById: state => id => state.software[id],
  getSoftwareCount: state => Number(state.length)
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
