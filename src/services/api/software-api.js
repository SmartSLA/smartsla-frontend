export default {
  getSoftwareById(softwareId) {
    return this.get(`/ticketing/api/software/${softwareId}`);
  },

  listSoftware({ sortBy = "-timestamps.creation" }) {
    return this.get(`/ticketing/api/software`, { params: { sortBy } });
  },

  createSoftware(options) {
    return this.post(`/ticketing/api/software`, options);
  },

  updateSoftware(softwareId, options) {
    return this.put(`/ticketing/api/software/${softwareId}`, options);
  },

  deleteSoftware(softwareId) {
    return this.delete(`/ticketing/api/software/${softwareId}`);
  }
};
