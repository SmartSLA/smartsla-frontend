import jwt from "./jwt";
import utils from "@websanova/vue-auth/src/lib/utils";
import { EXPERT_ROLE } from "@/constants";

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
  rolesVar: {
    entity: "ticketing",
    key: "role"
  },
  parseUserData(data) {
    return data;
  },
  check(role) {
    if (this.watch.authenticated === true) {
      if (role) {
        if (role === EXPERT_ROLE.ADMIN) {
          return (
            this.watch.data.roles.isApplicationAdmin ||
            this.watch.data.roles.isDomainAdmin ||
            this.watch.data.roles.isPlatformAdmin
          );
        }
        const { entity, key } = this.options.rolesVar;

        return utils.compare(role, this.watch.data[entity][key]);
      }

      return true;
    }

    return false;
  }
};
