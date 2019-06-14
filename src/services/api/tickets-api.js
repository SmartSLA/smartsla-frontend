export default {
  getTicketById(ticketId) {
    return this.get(`/ossa/ticket/${ticketId}`);
  },

  createTicket(options) {
    return this.post(`/ossa/ticket/create`, { options });
  },

  updateTicket(ticketId, options) {
    return this.put(`/ossa/ticket/${ticketId}`, { Id: ticketId, options: options });
  },

  deleteTicket(ticketId) {
    return this.post(`/ossa/ticket/${ticketId}`);
  },

  getTickets(author) {
    return this.get(`/ossa/ticket/author/${author}`);
  }
};
