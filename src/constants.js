export const DEFAULT_TIMEZONE = {
  name: "(GMT+01:00) Central European Time - Paris",
  value: "Europe/Paris"
};

export const OSSA_IDS = [
  {
    id: 3,
    color: "#dbc1ff",
    key: "Blocking"
  },
  {
    id: 2,
    color: "#8b60d8",
    key: "Non-blocking"
  },
  {
    id: 1,
    color: "#512da8",
    key: "Information"
  }
];

export const CONTRIBUTION_STATUS_LIST = ["Dev", "Reversed", "Integrated", "Published", "Rejected"];

export const SEVERITY_TYPES = ["Major", "Minor", "Blocking", "None"];

export const REQUEST_TYPES = ["Information", "Administration", "Anomaly", "Other"];

export const CONTRIBUTION_TYPES = ["Backport", "Correction", "Evolution"];

export const CONTRIBUTION_LINK_TYPES = ["Patch link", "binary link with the path", "Other"];

export const USER_TYPE = {
  EXPERT: "expert",
  BENEFICIARY: "beneficiary"
};

const BENEFICIARY_ROLES = ["customer", "viewer"];
const EXPERT_ROLES = ["manager", "expert"];

export const USER_ROLES = {
  expert: EXPERT_ROLES,
  beneficiary: BENEFICIARY_ROLES
};

export const UPDATE_COMMENT = {
  title: {
    changed: "{author} changed the title from {oldValue} to {newValue}."
  },
  beneficiary: {
    changed: "{author} changed the beneficiary from {oldValue} to {newValue}."
  },
  responsible: {
    added: "{author} added the responsible {newValue}.",
    changed: "{author} changed the responsible from {oldValue} to {newValue}."
  },
  callNumber: {
    changed: "{author} changed the call number from {oldValue} to {newValue}."
  },
  meetingId: {
    changed: "{author} changed the meeting ID from {oldValue} to {newValue}."
  },
  participants: {
    changed: "{author} changed the participants list."
  },
  type: {
    changed: "{author} changed the type from {oldValue} to {newValue}."
  },
  software: {
    changed: "{author} changed the software from {oldValue} to {newValue}.",
    added: "{author} added the software {newValue}.",
    removed: "{author} removed the software {oldValue}."
  },
  severity: {
    changed: "{author} changed the severity from {oldValue} to {newValue}.",
    added: "{author} added the severity {newValue}.",
    removed: "{author} removed the severity {oldValue}."
  },
  description: {
    changed: "{author} changed the description."
  },
  relatedrequests: {
    changed: "{author} changed the related requests."
  }
};
export const UNDEFINED_DURATION = "P0D";
