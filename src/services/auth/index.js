import jwt from "./jwt";

export default {
  auth: jwt,
  http: require("@websanova/vue-auth/drivers/http/axios.1.x"),
  router: require("@websanova/vue-auth/drivers/router/vue-router.2.x"),
  refreshData: {
    enabled: false
  },
  fetchData: {
    url: "api/user",
    method: "GET",
    enabled: true
  }
};
