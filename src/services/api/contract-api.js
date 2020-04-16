export default {
  getContractById(contractId) {
    return this.get(`/ticketing/api/contracts/${contractId}`);
  },

  getContractTicketsById(contractId) {
    return this.get(`/ticketing/api/contract/${contractId}/tickets`);
  },

  getContracts() {
    return this.get(`/ticketing/api/contracts`);
  },

  createContract(options) {
    return this.post(`/ticketing/api/contracts`, options);
  },

  updateContract(contractId, options) {
    return this.post(`/ticketing/api/contracts/${contractId}`, options);
  },

  deleteContract(contractId) {
    return this.delete(`/ticketing/api/contracts/${contractId}`);
  },

  getContractUsers(contractId) {
    return this.get(`/ticketing/api/contracts/${contractId}/users`).then(result => result.data || []);
  },

  addUsersToContract(contractId, users) {
    return this.post(`/ticketing/api/contracts/${contractId}/users`, users).then(result => result.data || []);
  }
};
