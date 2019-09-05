export default {
  ListHolidaysByYear(year) {
    return this.get(`/ticketing/api/holidays/${year}`);
  }
};
