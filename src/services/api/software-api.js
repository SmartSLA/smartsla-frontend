export default {
  getSoftwareById(softwareId) {
    return this.get(`/ticketing/api/software/${softwareId}`);
  },

  listSoftware() {
    return this.get(`/ticketing/api/software`);
  },

  createSoftware(options) {
    return this.post(`/ticketing/api/software`, options);
  },

  updateSoftware(softwareId, options) {
    return this.update(`/ticketing/api/software/${softwareId}`, options);
  },

  deleteSoftware(softwareId) {
    return this.delete(`/ticketing/api/software/${softwareId}`);
  }
};
