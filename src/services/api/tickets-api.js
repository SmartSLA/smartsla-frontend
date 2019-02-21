export default {
  getTicketById(ticketId) {
    return this.get(`/ossa/ticket/${ticketId}`);
  },

  createTicket(options) {
    console.log("hi");
    return this.post(`/ossa/ticket/create`, { options });
  },

  updateTicket(ticketId, options) {
    return this.put(`/ossa/ticket/${ticketId}`, { Id: ticketId, options: options });
  },

  deleteTicket(ticketId) {
    return this.delete(`/ossa/ticket/${ticketId}`);
  },

  getTickets(author) {
    return this.get(`/ossa/ticket/author/${author}`);
  }
};
