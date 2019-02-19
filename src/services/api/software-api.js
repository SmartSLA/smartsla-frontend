export default {
  getSoftwareById(softwareId) {
    return this.get(`/ossa/software/${softwareId}`);
  },

  getSoftware() {
    return this.get(`/ossa/software`);
  },

  createSoftware(options) {
    return this.post(`/ossa/software`, options);
  },

  updateSoftware(softwareId, options) {
    return this.update(`/ossa/software/${softwareId}`, options);
  },

  deleteSoftware(softwareId) {
    return this.delete(`/ossa/software/${softwareId}`);
  }
};
