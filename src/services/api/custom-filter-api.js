export default {
  listCustomFilters(userId) {
    return this.get(`/ticketing/api/custom-filters`, userId);
  },

  createCustomFilter(customFilter) {
    return this.post(`/ticketing/api/custom-filters`, customFilter);
  },

  updateCustomFilter(customFilterId, customFilter) {
    return this.put(`/ticketing/api/custom-filters/${customFilterId}`, customFilter);
  },

  deleteCustomFilter(customFilterId) {
    return this.delete(`/ticketing/api/custom-filters/${customFilterId}`);
  }
};
