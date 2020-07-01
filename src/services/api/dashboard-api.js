export default {
  getDashboardData(queryId, filterParams) {
    return this.get(`/ticketing/api/dashboard`, { params: { queryId, ...filterParams } });
  }
};
