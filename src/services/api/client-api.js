export default {
  getClientById(clientId) {
    return this.get(`/ticketing/api/organizations/${clientId}`);
  },

  listClients() {
    return this.get(`/ticketing/api/organizations`);
  },

  createClient(client) {
    return this.post(`/ticketing/api/organizations`, client, { useCredentails: true });
  },

  updateClient(clientId, client) {
    return this.update(`/ticketing/api/organizations/${clientId}`, client);
  },

  deleteClient(clientId) {
    return this.delete(`/ticketing/api/organizations/${clientId}`);
  }
};
