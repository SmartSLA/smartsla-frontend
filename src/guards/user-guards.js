import store from "@/store";
import { routeNames as routes } from "@/router";

export function canViewProfile(to, from, next) {
  const app = window.Application;
  if (to.params.id === store.getters["user/getId"] || app.$auth.check("admin")) {
    return next();
  }
  return next({ name: routes.REQUESTS });
}
