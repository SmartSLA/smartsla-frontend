import Vue from "vue";
import { isString, isNumber, isUndefined } from "lodash";

function initialState() {
  return {
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsPerPageItems: [10, 25, 50, { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }],
      totalItems: null,
      descending: false,
      sortBy: "_id"
    },
    length: 0,
    contributions: {}
  };
}

const types = {
  SET_CONTRIBUTIONS: "SET_CONTRIBUTIONS",
  SET_CONTRIBUTION: "SET_CONTRIBUTION",
  SET_CONTRIBUTIONS_LENGTH: "SET_CONTRIBUTIONS_LENGTH",
  SET_PAGINATION: "SET_PAGINATION",
  REMOVE_CONTRIBUTION: "REMOVE_CONTRIBUTION",
  RESET_CONTRIBUTIONS: "RESET_CONTRIBUTIONS"
};

const actions = {
  fetchContributions: ({ commit, state, dispatch, rootGetters }) => {
    return Vue.axios
      .getContributions({
        limit: state.pagination.rowsPerPage,
        offset: (state.pagination.page - 1) * state.pagination.rowsPerPage,
        a: rootGetters["filter/queryAdditionalFilters"]
      })
      .then(({ data }) => {
        dispatch("countContributions");
        commit(types.SET_CONTRIBUTIONS, data);
      });
  },

  fetchContributionById: ({ commit }, contributionId) => {
    return Vue.axios.getContributionById(contributionId).then(({ data }) => {
      commit(types.SET_CONTRIBUTION, data);
    });
  },

  countContributions: ({ commit }) => {
    return Vue.axios
      .countContributions()
      .then(size => commit(types.SET_CONTRIBUTIONS_LENGTH, size))
      .catch(err => {
        console.log(err); // eslint-disable-line no-console
      });
  },

  createContribution: ({ commit }, contribution) => {
    return Vue.axios.createContribution(contribution).then(({ data }) => commit(types.SET_CONTRIBUTION, data));
  },

  updateContribution: ({ dispatch }, { contributionId, contribution }) => {
    return Vue.axios
      .updateContribution(contributionId, contribution)
      .then(() => dispatch("fetchContributionById", contributionId));
  },

  updateContributionStatus: ({ dispatch }, { contributionId, options }) => {
    return Vue.axios
      .updateContributionStatus(contributionId, options)
      .then(() => dispatch("fetchContributionById", contributionId));
  },

  setPagination: ({ commit }, pagination) => {
    commit(types.SET_PAGINATION, pagination);
  },

  deleteContribution: ({ commit }, contributionId) => {
    return Vue.axios.deleteContribution(contributionId).then(() => commit(types.REMOVE_CONTRIBUTION, contributionId));
  },

  resetContributions: ({ commit }) => {
    commit(types.RESET_CONTRIBUTIONS);
  }
};

const mutations = {
  [types.SET_CONTRIBUTIONS](state, contributions) {
    (contributions || []).forEach(contribution => Vue.set(state.contributions, contribution._id, contribution));
  },

  [types.SET_CONTRIBUTION](state, contribution) {
    Vue.set(state.contributions, contribution._id, contribution);
  },

  [types.SET_CONTRIBUTIONS_LENGTH](state, length) {
    state.length = length;
    Vue.set(state.pagination, "totalItems", Number(length));
  },

  [types.SET_PAGINATION](state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  },

  [types.REMOVE_CONTRIBUTION](state, contributionId) {
    Vue.delete(state.contributions, contributionId);
  },

  [types.RESET_CONTRIBUTIONS](state) {
    state.contributions = {};
  }
};

const getters = {
  getContributionById: state => id => state.contributions[id],
  getContributionsCount: state => Number(state.length),
  pagination: state => state.pagination,
  getContributions: state => {
    const { sortBy, descending, page, rowsPerPage, totalItems } = state.pagination;
    let result = (Object.values(state.contributions) || []).map(contribution => {
      const { software, author, timestamps } = contribution;

      return {
        ...contribution,
        author: author,
        software: software.name,
        creation: timestamps.creation
      };
    });

    if (sortBy) {
      result = result.sort((a, b) => {
        const valueA = !isUndefined(a[sortBy]) ? a[sortBy] : "";
        const valueB = !isUndefined(b[sortBy]) ? b[sortBy] : "";

        if (isString(valueA) && isString(valueB)) {
          return descending
            ? valueA.localeCompare(valueB, "fr", { ignorePunctuation: true })
            : valueB.localeCompare(valueA, "fr", { ignorePunctuation: true });
        }

        let sortResult = isNumber(valueA) && isNumber(valueB) ? valueB - valueA : b - a;

        return descending ? sortResult : -sortResult;
      });
    }

    const rowsPerPageDisplay = rowsPerPage === -1 ? totalItems : rowsPerPage;

    return result.slice((page - 1) * rowsPerPageDisplay, page * rowsPerPageDisplay);
  }
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
