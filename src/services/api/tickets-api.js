export default {
  getTicketById(ticketId) {
    return this.get(`/ticketing/api/tickets/${ticketId}`);
  },

  createTicket(options) {
    return this.post(`/ticketing/api/tickets`, options);
  },

  updateTicket(ticketId, options) {
    return this.post(`/ticketing/api/tickets/${ticketId}`, options);
  },

  updateRelatedContributions(ticketId, options) {
    return this.post(`/ticketing/api/tickets/${ticketId}/contributions`, options);
  },

  addTicketEvent(ticketId, options) {
    return this.put(`/ticketing/api/tickets/${ticketId}/events`, options);
  },

  // TO DO: verify if it's DELETE or POST
  deleteTicket(ticketId) {
    return this.post(`/ticketing/api/tickets/${ticketId}`);
  },

  listTickets({ limit = 50, offset = 0 }) {
    return this.get("/ticketing/api/tickets", { params: { limit, offset } });
  },

  countTickets() {
    return this.head("/ticketing/api/tickets", { params: { limit: 1 } }).then(response => {
      return response.headers["x-esn-items-count"] || 0;
    });
  },

  exportTickets(exportType = "csv") {
    return this.get("/ticketing/api/tickets", { params: { export: exportType } });
  }
};
