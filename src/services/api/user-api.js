export default {
  createUser(options) {
    return this.post(`/ticketing/api/users`, options);
  },

  listUsers() {
    return this.get(`/ticketing/api/users`);
  }
};
