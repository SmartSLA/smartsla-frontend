export default {
  createUser(options) {
    return this.post(`/ticketing/api/users`, options);
  },

  listUsers() {
    return this.get(`/ticketing/api/users`);
  },

  getConnectedUserId() {
    return this.get(`/api/user`);
  },

  getUserById(userId) {
    return this.get(`/ticketing/api/users/${userId}`);
  },

  deleteUser(userId) {
    return this.delete(`/ticketing/api/users/${userId}`);
  }
};
