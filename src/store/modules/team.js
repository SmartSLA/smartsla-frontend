import Vue from "vue";

function initialState() {
  return {
    teams: {},
    count: 0
  };
}

const types = {
  SET_TEAMS: "SET_TEAMS",
  UPDATE_TEAM: "UPDATE_TEAM",
  SET_LENGTH: "SET_LENGTH",
  REMOVE_TEAM: "REMOVE_TEAM"
};

const actions = {
  fetchTeams: ({ commit, dispatch }) => {
    return Vue.axios
      .listTeam()
      .then(({ data }) => {
        dispatch("countTeams");
        commit(types.SET_TEAMS, data);
      })
      .catch(console.log); // eslint-disable-line no-console
  },

  fetchTeamById: ({ commit }, teamId) => {
    return Vue.axios
      .getTeamById(teamId)
      .then(({ data }) => commit(types.UPDATE_TEAM, data))
      .catch(console.log); // eslint-disable-line no-console
  },

  createTeam: ({ commit }, team) => {
    return Vue.axios.createTeam(team).then(({ data }) => commit(types.UPDATE_TEAM, data));
  },

  updateTeam: ({ dispatch }, { teamId, team }) => {
    return Vue.axios.updateTeam(teamId, team).then(() => dispatch("fetchTeamById", teamId));
  },

  deleteTeam: ({ commit }, teamId) => {
    return Vue.axios.deleteTeam(teamId).then(() => commit(types.REMOVE_TEAM, teamId));
  },

  countTeams: ({ commit }) => {
    return Vue.axios
      .countTeams()
      .then(size => commit(types.SET_LENGTH, size))
      .catch(console.log); // eslint-disable-line no-console
  }
};

const mutations = {
  [types.SET_TEAMS](state, teams) {
    (teams || []).forEach(team => Vue.set(state.teams, team._id, team));
  },

  [types.UPDATE_TEAM](state, team) {
    const { _id } = team;
    Vue.set(state.teams, _id, team);
  },

  [types.REMOVE_TEAM](state, teamId) {
    Vue.delete(state.teams, teamId);
  },

  [types.SET_LENGTH](state, size) {
    state.count = size;
  }
};

const getters = {
  getTeams: state => Object.values(state.teams) || [],
  getTeamById: state => id => state.teams[id] || {},
  getTeamsCount: state => Number(state.count)
};

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations,
  getters
};
