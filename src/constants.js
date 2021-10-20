export const DEFAULT_TIMEZONE = {
  name: "(GMT+01:00) Central European Time - Paris",
  value: "Europe/Paris"
};

export const CONTRIBUTION_STATUS = {
  DEVELOP: "develop",
  REVERSED: "reversed",
  INTEGRATED: "integrated",
  PUBLISHED: "published",
  REJECTED: "rejected"
};

export const CATEGORIES_CONTRIBUTIONS_FILTERS = {
  type: "Type",
  status: "Status",
  software: "Software",
  author: "Author"
};

export const SEVERITY_TYPES = ["Major", "Minor", "Blocking", "None"];

export const REQUEST_TYPE = {
  INFORMATION: "Information",
  ADMINISTRATION: "Administration",
  ANOMALY: "Anomaly",
  OTHER: "Other"
};

export const REQUEST_TYPES = [
  REQUEST_TYPE.INFORMATION,
  REQUEST_TYPE.ADMINISTRATION,
  REQUEST_TYPE.ANOMALY,
  REQUEST_TYPE.OTHER
];

export const CONTRACT_STATUS = {
  EXPIRED: "expired",
  ACTIVE: "active",
  INACTIVE: "inactive"
};

export const CLIENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive"
};

export const CONTRIBUTION_TYPES = {
  backport: "Backport",
  correction: "Correction",
  evolution: "Evolution"
};

export const CONTRIBUTION_LINK_TYPES = ["Patch link", "binary link with the path", "Other"];

export const USER_TYPE = {
  EXPERT: "expert",
  BENEFICIARY: "beneficiary",
  ADMIN: "admin"
};

export const EXPERT_ROLE = {
  ADMIN: "admin",
  EXPERT: "expert"
};

export const BENEFICIARY_ROLES = ["viewer", "customer"];

export const BENEFICIARY_ROLE_LIST = {
  VIEWER: "viewer",
  CUSTOMER: "customer",
  OPERATIONAL_MANAGER: "operational manager",
  CONTRACT_MANAGER: "contract manager"
};

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
    changed: "{author} changed the participants list from {oldValue} to {newValue}.",
    added: "{author} added {newValue} to the participants list",
    removed: "{author} removed {oldValue} from the participants list"
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
  relatedRequests: {
    changed: "{author} changed the related requests from {oldValue} to {newValue}.",
    added: "{author} added {newValue} to the related requests",
    removed: "{author} removed {oldValue} from the related requests"
  }
};
export const UNDEFINED_DURATION = "P0D";

export const TICKET_STATUS = {
  NEW: "new",
  SUPPORTED: "supported",
  BYPASSED: "bypassed",
  RESOLVED: "resolved",
  CLOSED: "closed"
};

export const TICKET_STATUS_ID = {
  NEW: 0,
  SUPPORTED: 1,
  BYPASSED: 2,
  RESOLVED: 3,
  CLOSED: 4
};

export const ANOMALY_NEXT_STATUS = {
  new: "supported",
  supported: "bypassed",
  bypassed: "resolved",
  resolved: "closed"
};

export const NEXT_STATUS = {
  new: "supported",
  supported: "resolved",
  resolved: "closed"
};

export const CNS_TYPES = {
  SUPPORT: "supported",
  BYPASS: "bypassed",
  RESOLUTION: "resolved"
};

export const CNS_STATUS = {
  new: "cns.state.support",
  supported: "cns.state.resolution",
  resolved: "cns.state.closure",
  closed: "cns.state.closed"
};

export const ANOMALY_CNS_STATUS = {
  new: "cns.state.support",
  supported: "cns.state.bypass",
  bypassed: "cns.state.resolution",
  resolved: "cns.state.closure",
  closed: "cns.state.closed"
};

export const INITIAL_FILTER = {
  name: "Open tickets",
  _id: ""
};

export const WIDGET_DURATION_INTERVAL = {
  ANY_TIME: "Any time",
  LAST_WEEK: "Last 7 days",
  LAST_MONTH: "Last month",
  LAST_QUARTER: "Last quarter",
  LAST_YEAR: "Year"
};

export const RELATED_REQUEST_TYPES = [
  "Linked at",
  "Duplicated",
  "Duplicated by",
  "Blocked",
  "Blocked by",
  "Previous",
  "Next"
];

export const DASHBOARD_GROUP_BY_FILTER = ["day", "week", "month", "quarter", "year"];

export const TICKET_DRAFT_STORAGE_KEY_PREFIX = "ticketDraft_";

export const SORT_FILTERS_KEYS = ["software", "Assignto", "responsible", "author", "contract"];

export const CATEGORIES_REQUESTS_FILTERS = {
  type: "Type",
  status: "Status",
  severity: "Severity",
  software: "Software",
  assignto: "Assign to",
  responsible: "Responsible",
  author: "Author",
  contract: "Contract",
  client: "Client"
};

export const TYPES_REQUESTS_FILTERS = {
  information: "Information",
  anomaly: "Software anomaly",
  administration: "Administration",
  softwareVulnerability: "softwareVulnerability",
  other: "Other"
};

export const SEVERITIES_REQUESTS_FILTERS = {
  blocking: "Blocking",
  minor: "Minor",
  major: "Major"
};

export const STATUS_REQUESTS_FILTERS = {
  new: "New",
  supported: "Supported",
  bypassed: "Bypassed",
  resolved: "Resolved",
  closed: "Closed"
};
