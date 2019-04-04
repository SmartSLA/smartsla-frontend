export default {
  getClientById(clientId) {
    return this.get(`/ticketing/api/organizations/${clientId}`);
  },

  listClients() {
    return this.get(`/ticketing/api/organizations`);
  },

  createClient(client) {
<<<<<<< HEAD
    return this.post(`/ticketing/api/organizations`, client, {
      useCredentials: true
    });
=======
    return this.post(`/ticketing/api/organizations`, client, { useCredentails: true });
>>>>>>> dc486f381514a34556c1685e9f2bd6a48be87c69
  },

  updateClient(clientId, client) {
    return this.update(`/ticketing/api/organizations/${clientId}`, client);
  },

  deleteClient(clientId) {
    return this.delete(`/ticketing/api/organizations/${clientId}`);
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> dc486f381514a34556c1685e9f2bd6a48be87c69
