export default {
  listFilters(userId) {
    return this.get(`/ticketing/api/filters`, userId);
  },

  createFilters(filter) {
    return this.post(`/ticketing/api/filters`, filter);
  },

  updateFilters(filterId, filter) {
    return this.put(`/ticketing/api/filters/${filterId}`, filter);
  },

  deleteFilters(filterId) {
    return this.delete(`/ticketing/api/filters/${filterId}`);
  }
};
