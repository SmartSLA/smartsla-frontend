import store from "@/store";
import { USER_TYPE } from "@/constants.js";

import { routeNames as routes } from "@/router";

export function canViewProfile(to, from, next) {
  const app = window.Application;

  if (to.params.id === store.getters["currentUser/getId"]) {
    return next();
  }

  if (app.$auth.check(USER_TYPE.ADMIN)) {
    return next({ name: routes.USER, params: { id: to.params.id } });
  }

  return next({ name: routes.REQUESTS });
}

export function canEditProfile(to, from, next) {
  const app = window.Application;

  if (to.params.id === store.getters["currentUser/getId"]) {
    return next();
  }

  if (app.$auth.check(USER_TYPE.ADMIN)) {
    return next({ name: routes.EDITUSER, params: { id: to.params.id } });
  }

  return next({ name: routes.REQUESTS });
}
