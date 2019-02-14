import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import CreateRequest from "@/views/CreateRequest.vue";
import Requests from "@/views/Requests.vue";
import Login from "@/views/Login.vue";
import ApplicationSettings from "@/services/application-settings";

Vue.use(Router);

// Set your routes here
export const routeNames = Object.freeze({
  HOME: "Home",
  CREATEREQUEST: "Create Request",
  REQUESTS: "Requests",
  LOGIN: "Login"
});

export default new Router({
  base: ApplicationSettings.BASE_URL, // Needed for dev/build and HTML history
  mode: "history",
  routes: [
    {
      path: "/",
      name: routeNames.HOME,
      component: Home,
      meta: {
        auth: true
      }
    },
    {
      path: "/create-request",
      name: routeNames.CREATEREQUEST,
      component: CreateRequest,
      meta: {
        auth: true
      }
    },
    {
      path: "/requests",
      name: routeNames.REQUESTS,
      component: Requests,
      meta: {
        auth: true
      }
    },
    {
      path: "/login",
      name: routeNames.LOGIN,
      component: Login,
      meta: {
        auth: false
      }
    }
  ]
});
