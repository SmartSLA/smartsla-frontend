export default {
  getContributions({ limit = 50, offset = 0 }) {
    return this.get(`/ticketing/api/contributions`, { params: { limit, offset } });
  },

  getContributionById(contributionId) {
    return this.get(`/ticketing/api/contributions/${contributionId}`);
  },

  countContributions() {
    return this.head(`/ticketing/api/contributions`).then(response => {
      return response.headers["x-esn-items-count"] || 0;
    });
  },

  createContribution(options) {
    return this.post(`/ticketing/api/contributions`, options);
  },

  updateContribution(contributionId, options) {
    return this.post(`/ticketing/api/contributions/${contributionId}`, options);
  },

  updateContributionStatus(contributionId, options) {
    return this.post(`/ticketing/api/contributions/${contributionId}/status`, options);
  },

  deleteContribution(contributionId) {
    return this.delete(`/ticketing/api/contributions/${contributionId}`);
  }
};
