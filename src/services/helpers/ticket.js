import { UNDEFINED_DURATION } from "@/constants";

export { getTicketSoftwareEngagement, getEngagementHours };

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
      supported: getEngagementHours(foundEngagements.supported, ticket.createdDuringBusinessHours),
      bypassed: getEngagementHours(foundEngagements.bypassed, ticket.createdDuringBusinessHours),
      resolved: getEngagementHours(foundEngagements.resolved, ticket.createdDuringBusinessHours)
    }
  );
}

function isEngagementInBusinessHour(engagement, useBusinessHours) {
  return useBusinessHours || engagement.nonBusinessHours === UNDEFINED_DURATION;
}

function getEngagementHours(engagement, useBusinessHours) {
  const businessHours = isEngagementInBusinessHour(engagement, useBusinessHours);
  const hours = businessHours ? engagement.businessHours : engagement.nonBusinessHours;

  return {
    hours,
    businessHours
  };
}
