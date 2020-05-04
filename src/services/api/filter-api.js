export default {
  listFilters() {
    return this.get(`/ticketing/api/filters`);
  }
};
