export default {
  getContributionById(contributionId) {
    return this.get(`/ticketing/api/contributions/${contributionId}`);
  },

  getContributions() {
    return this.get(`/ticketing/api/contributions`);
  },

  createContribution(options) {
    return this.post(`/ticketing/api/contributions`, options);
  },

  updateContribution(contributionId, options) {
    return this.post(`/ticketing/api/contributions/${contributionId}`, options);
  },

  deleteContribution(contributionId) {
    return this.delete(`/ticketing/api/contributions/${contributionId}`);
  }
};
