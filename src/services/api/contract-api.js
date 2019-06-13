export default {
  getContractById(contractId) {
    return this.get(`/ticketing/api/contracts/${contractId}`);
  },

  getContracts() {
    return this.get(`/ticketing/api/contracts`);
  },

  createContract(options) {
    return this.post(`/ticketing/api/contracts`, options);
  },

  updateContract(contractId, options) {
    return this.update(`/ticketing/api/contracts/${contractId}`, options);
  },

  deleteContract(contractId) {
    return this.delete(`/ticketing/api/contracts/${contractId}`);
  }
};
