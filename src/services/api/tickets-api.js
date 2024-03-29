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

  addParticipants(ticketId, participants) {
    return this.put(`/ticketing/api/tickets/${ticketId}/participants`, { participants });
  },

  toggleCommentDeletion(ticketId, eventId, options) {
    return this.patch(`/ticketing/api/tickets/${ticketId}/events/${eventId}/comment`, options);
  },

  updateComment(ticketId, eventId, options) {
    return this.put(`/ticketing/api/tickets/${ticketId}/events/${eventId}/comment`, options);
  },

  // TO DO: verify if it's DELETE or POST
  deleteTicket(ticketId) {
    return this.post(`/ticketing/api/tickets/${ticketId}`);
  },

  listTickets({ limit = 50, offset = 0, filter, a }) {
    return this.get("/ticketing/api/tickets", { params: { limit, offset, filter, a } });
  },

  countTickets() {
    return this.head("/ticketing/api/tickets").then(({ headers }) => {
      return headers["x-esn-items-count"] || 0;
    });
  },

  exportTickets(exportType = "csv") {
    return this.get("/ticketing/api/tickets", { params: { export: exportType } });
  },

  searchTickets(query, contract = null) {
    let params = { q: query };

    if (contract) {
      params = { ...params, contract };
    }

    return this.get("/ticketing/api/tickets/search", { params });
  }
};
