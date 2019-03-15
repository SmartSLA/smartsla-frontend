import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import CreateRequest from "@/views/CreateRequest.vue";
import Requests from "@/views/Requests.vue";
import Request from "@/views/Request.vue";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Satisfaction from "@/views/Satisfaction.vue";
import Historic from "@/views/Historic.vue";
import Contributions from "@/views/Contributions.vue";
import Orders from "@/views/Orders.vue";
import Profile from "@/views/Profile.vue";
import Settings from "@/views/Settings.vue";
import ApplicationSettings from "@/services/application-settings";
import CreateClient from "@/views/CreateClient.vue";
import Administration from "@/views/admin/Administration.vue";
import Users from "@/views/admin/Users.vue";
import Contracts from "@/views/admin/Contracts.vue";

Vue.use(Router);

// Set your routes here
export const routeNames = Object.freeze({
  HOME: "Home",
  CREATEREQUEST: "Create Request",
  CREATECLIENT: "Create Client",
  REQUESTS: "Requests",
  REQUEST: "Request",
  DASHBOARD: "Dashboard",
  SATISFACTION: "Satisfaction",
  HISTORIC: "Historic",
  CONTRIBUTIONS: "Contributions",
  ORDERS: "Orders",
  PROFILE: "Profile",
  SETTINGS: "Settings",
  LOGIN: "Login",
  ADMINISTRATION: "Administration",
  USERS: "Users",
  CONTRACTS: "Contracts"
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
      path: "/create-client",
      name: routeNames.CREATECLIENT,
      component: CreateClient,
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
      path: "/request/:id",
      name: routeNames.REQUEST,
      component: Request,
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
    },
    {
      path: "/dashboard",
      name: routeNames.DASHBOARD,
      component: Dashboard,
      meta: {
        auth: true
      }
    },
    {
      path: "/satisfaction",
      name: routeNames.SATISFACTION,
      component: Satisfaction,
      meta: {
        auth: true
      }
    },
    {
      path: "/historic",
      name: routeNames.HISTORIC,
      component: Historic,
      meta: {
        auth: true
      }
    },
    {
      path: "/contributions",
      name: routeNames.CONTRIBUTIONS,
      component: Contributions,
      meta: {
        auth: true
      }
    },
    {
      path: "/orders",
      name: routeNames.ORDERS,
      component: Orders,
      meta: {
        auth: true
      }
    },
    {
      path: "/profile",
      name: routeNames.PROFILE,
      component: Profile,
      meta: {
        auth: true
      }
    },
    {
      path: "/settings",
      name: routeNames.SETTINGS,
      component: Settings,
      meta: {
        auth: true
      }
    },
    {
      path: "/administration",
      name: routeNames.ADMINISTRATION,
      component: Administration,
      meta: {
        auth: true
      }
    },
    {
      path: "/users",
      name: routeNames.USERS,
      component: Users,
      meta: {
        auth: true
      }
    },
    {
      path: "/contracts",
      name: routeNames.Contracts,
      component: Contracts,
      meta: {
        auth: true
      }
    }
  ]
});
