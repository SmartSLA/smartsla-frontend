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
  }
};
