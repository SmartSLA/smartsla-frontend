export default {
  getContractById(contractId) {
    return this.get(`/ossa/contracts/${contractId}`);
  },

  getContracts() {
    return this.get(`/ossa/contracts`);
  },

  createContract(options) {
    return this.post(`/ossa/contracts`, options);
  },

  updateContract(contractId, options) {
    return this.update(`/ossa/contracts/${contractId}`, options);
  },

  deleteContract(contractId) {
    return this.delete(`/ossa/contracts/${contractId}`);
  }
};
