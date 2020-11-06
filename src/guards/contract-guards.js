import { routeNames } from "@/router";
import { BENEFICIARY_ROLE_LIST, EXPERT_ROLE } from "@/constants";

export function canListContracts(to, from, next) {
  if (userHasPermission()) {
    return next();
  }

  return next({ name: routeNames.HOME });
}

export function canViewContract(to, from, next) {
  if (!userHasPermission()) {
    return next({ name: routeNames.HOME });
  }

  const { id } = to.params;
  const app = window.Application;
  const baseUrl = window.Application.$store.state.applicationConfiguration.baseUrl;
  app.$http
    .head(`${baseUrl}/ticketing/api/contracts/${id}`)
    .then(() => {
      next();
    })
    .catch(() => {
      next({ name: routeNames.HOME });
    });
}

function userHasPermission() {
  const app = window.Application;

  return (
    app.$auth.check("admin") ||
    app.$auth.check(EXPERT_ROLE.EXPERT) ||
    app.$auth.check(BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER) ||
    app.$auth.check(BENEFICIARY_ROLE_LIST.OPERATIONAL_MANAGER) ||
    app.$auth.check(BENEFICIARY_ROLE_LIST.CUSTOMER) ||
    app.$auth.check(BENEFICIARY_ROLE_LIST.VIEWER)
  );
}
