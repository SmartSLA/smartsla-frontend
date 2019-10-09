import jwt from "./jwt";

export default {
  auth: jwt,
  http: require("@websanova/vue-auth/drivers/http/axios.1.x"),
  router: require("@websanova/vue-auth/drivers/router/vue-router.2.x"),
  refreshData: {
    enabled: false
  },
  fetchData: {
    url: "ticketing/api/user",
    method: "GET",
    enabled: true
  },
  rolesVar: "roles",
  parseUserData(data) {
    return data;
  },
  check(role) {
    if (this.watch.authenticated === true) {
      if (role === "admin") {
        return (
          this.watch.data.roles.isApplicationAdmin ||
          this.watch.data.roles.isDomainAdmin ||
          this.watch.data.roles.isPlatformAdmin
        );
      }

      return true;
    }

    return false;
  }
};
