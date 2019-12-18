export { getTicketSoftwareEngagement };

function getTicketSoftwareEngagement(ticket) {
  const engagements =
    ticket &&
    ticket.software &&
    ticket.software.critical &&
    ticket.contract &&
    ticket.contract.Engagements[ticket.software.critical] &&
    ticket.contract.Engagements[ticket.software.critical].engagements;

  return (
    engagements &&
    engagements.find(function(engagement) {
      return engagement.severity === ticket.severity && engagement.request === ticket.type;
    })
  );
}
