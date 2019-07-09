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
  },
  rolesVar: "isPlatformAdmin",
  parseUserData(data) {
    return data;
  },
  check(role, key) {
    if (this.watch.authenticated === true) {
      if (role === "admin") {
        //return this.watch.data[key || this.options.rolesVar];
        return (
          this.watch.data.preferredEmail == "hgoguelin@linagora.com" ||
          this.watch.data.preferredEmail == "wgharbi@linagora.com" ||
          this.watch.data.preferredEmail == "jsbevilacqua@linagora.com" ||
          this.watch.data.preferredEmail == "dkaoua@linagora.com" ||
          this.watch.data.preferredEmail == "sphanivon@linagora.com" ||
          this.watch.data.preferredEmail == "kferjani@linagora.com" ||
          this.watch.data.preferredEmail == "mmaudet@linagora.com" ||
          this.watch.data.preferredEmail == "iabouljamal@linagora.com" ||
          this.watch.data.preferredEmail == "iboudhiba@linagora.com" ||
          this.watch.data[key || this.options.rolesVar]
        );
      }

      return true;
    }

    return false;
  }
};
