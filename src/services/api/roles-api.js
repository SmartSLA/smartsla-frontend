export default {
  /**
   * Get all the registered roles
   * @param {hash} options has {limit, offset}
   */
  getUsersRoles(options) {
    return this.get("/ticketing/api/roles", options).then(result => result.data || []);
  },

  /**
   * @param {roles}: Array of {user, role} where user is userId, role is String
   */
  createRoles(roles) {
    return this.post("/ticketing/api/roles", roles);
  },

  deleteRole(roleId) {
    return this.delete(`/ticketing/api/roles/${roleId}`)
  }
};
