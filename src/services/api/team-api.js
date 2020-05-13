export default {
  getTeamById(teamId) {
    return this.get(`/ticketing/api/team/${teamId}`);
  },

  listTeam() {
    return this.get(`/ticketing/api/team`);
  },

  createTeam(options) {
    return this.post(`/ticketing/api/team`, options);
  },

  updateTeam(teamId, options) {
    return this.post(`/ticketing/api/team/${teamId}`, options);
  },

  deleteTeam(teamId) {
    return this.delete(`/ticketing/api/team/${teamId}`);
  },

  countTeams() {
    return this.head("ticketing/api/team").then(({ headers }) => headers["x-esn-items-count"] || 0);
  }
};
