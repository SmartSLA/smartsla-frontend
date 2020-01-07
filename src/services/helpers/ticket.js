import { UNDEFINED_DURATION } from "@/constants";

export { getTicketSoftwareEngagement };

function getTicketSoftwareEngagement(ticket) {
  const engagements =
    ticket &&
    ticket.software &&
    ticket.software.critical &&
    ticket.contract &&
    ticket.contract.Engagements[ticket.software.critical] &&
    ticket.contract.Engagements[ticket.software.critical].engagements;

  const foundEngagements =
    engagements &&
    engagements.find(function(engagement) {
      return engagement.severity === ticket.severity && engagement.request === ticket.type;
    });

  return (
    foundEngagements && {
      supported: getEngagementHours(ticket, foundEngagements.supported),
      bypassed: getEngagementHours(ticket, foundEngagements.bypassed),
      resolved: getEngagementHours(ticket, foundEngagements.resolved)
    }
  );
}

function isEngagementInBusinessHour(ticket, engagement) {
  return ticket.createdDuringBusinessHours || engagement.nonBusinessHours === UNDEFINED_DURATION;
}

function getEngagementHours(request, engagement) {
  const businessHours = isEngagementInBusinessHour(request, engagement);
  const hours = businessHours ? engagement.businessHours : engagement.nonBusinessHours;

  return {
    hours,
    businessHours
  };
}
