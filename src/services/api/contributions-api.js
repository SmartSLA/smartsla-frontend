export default {
  getContributions({ limit = 50, offset = 0 }) {
    return this.get(`/ticketing/api/contributions`, { params: { limit, offset } });
  },

  countContributions() {
    return this.head(`/ticketing/api/contributions`, { params: { limit: 1 } }).then(response => {
      return response.headers["x-esn-items-count"] || 0;
    });
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
