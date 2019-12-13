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

export const SEVERITY_TYPES = ["Major", "Minor", "Blocking", "None"];

export const REQUEST_TYPES = ["Information", "Anomaly", "Other"];

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
