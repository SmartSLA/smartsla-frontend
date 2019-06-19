export default {
  getContributionById(contributionId) {
    return this.get(`/ossa/contributions/${contributionId}`);
  },

  getContributions() {
    return this.get(`/ossa/contributions`);
  },

  createContribution(options) {
    return this.post(`/ossa/contributions/`, options);
  },

  updateContribution(contributionId, options) {
    return this.post(`/ossa/contributions/${contributionId}`, options);
  },

  deleteContribution(contributionId) {
    return this.delete(`/ossa/contribution/${contributionId}`);
  }
};
