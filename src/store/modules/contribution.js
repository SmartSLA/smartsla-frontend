import Vue from "vue";

function initialState() {
  return {
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsPerPageItems: [10, 25, 50, 100],
      totalItems: null,
      descending: true
    },
    length: 0,
    contributions: {}
  };
}

const types = {
  SET_CONTRIBUTIONS: "SET_CONTRIBUTIONS",
  SET_CONTRIBUTIONS_LENGTH: "SET_CONTRIBUTIONS_LENGTH",
  SET_PAGINATION: "SET_PAGINATION"
};

const actions = {
  fetchContributions: ({ commit, state }) => {
    return Vue.axios
      .getContributions({
        limit: state.pagination.rowsPerPage,
        offset: (state.pagination.page - 1) * state.pagination.rowsPerPage
      })
      .then(response => {
        commit(types.SET_CONTRIBUTIONS, response.data);
      });
  },

  countContributions: ({ commit }) => {
    return Vue.axios
      .countContributions()
      .then(size => commit(types.SET_CONTRIBUTIONS_LENGTH, size))
      .catch(err => {
        console.log(err);
      });
  },

  setPagination: ({ commit }, pagination) => {
    commit(types.SET_PAGINATION, pagination);
  }
};

const mutations = {
  [types.SET_CONTRIBUTIONS](state, contributions) {
    (contributions || []).forEach(contribution => Vue.set(state.contributions, contribution._id, contribution));
  },

  [types.SET_CONTRIBUTIONS_LENGTH](state, length) {
    state.length = length;
    Vue.set(state.pagination, "totalItems", Number(length));
  },

  [types.SET_PAGINATION](state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  }
};

const getters = {
  getContributions: state => Object.values(state.contributions) || [],
  getContributionById: state => id => state.contributions[id],
  getContributionsCount: state => Number(state.length),
  pagination: state => state.pagination
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
