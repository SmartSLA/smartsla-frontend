export default {
  getClientById(clientId) {
    return this.get(`/ticketing/api/client/${clientId}`);
  },

  listClients() {
    return this.get(`/ticketing/api/client`);
  },

  createClient(client) {
    return this.post(`/ticketing/api/client`, client);
  },

  updateClient(clientId, client) {
    return this.post(`/ticketing/api/client/${clientId}`, client);
  },

  deleteClient(clientId) {
    return this.delete(`/ticketing/api/client/${clientId}`);
  },

  countClients() {
    return this.head("/ticketing/api/client").then(({ headers }) => headers["x-esn-items-count"] || 0);
  }
};
