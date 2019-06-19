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
  }
};
