import { routeNames as routes } from "@/router";

export function requireRead(to, from, next) {
  const { id } = to.params ;
  const app = window.Application;
  const baseUrl = app.$store.state.applicationConfiguration.baseUrl;
  app.$http.head(`${baseUrl}/ticketing/api/tickets/${id}`).then(() => {
    next();
  })
  .catch(() => {
    next({ name: routes.REQUESTS });
  })
}