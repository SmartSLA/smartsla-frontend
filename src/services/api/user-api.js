export default {
  getCurrentTicketingUser() {
    return this.get("/ticketing/api/user").then(({ data }) => data);
  },

  createUser(options) {
    return this.post(`/ticketing/api/users`, options);
  },

  listUsers() {
    return this.get(`/ticketing/api/users`);
  },

  getUserById(userId) {
    return this.get(`/ticketing/api/users/${userId}`);
  },

  deleteUser(userId) {
    return this.delete(`/ticketing/api/users/${userId}`);
  },

  updateUser(userId, options) {
    return this.put(`/ticketing/api/users/${userId}`, options);
  }
};
