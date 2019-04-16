import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import CreateRequest from "@/views/request/CreateRequest.vue";
import Requests from "@/views/request/Requests.vue";
import Request from "@/views/request/Request.vue";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import Satisfaction from "@/views/satisfaction/Satisfaction.vue";
import Historic from "@/views/history/Historic.vue";
import Contributions from "@/views/contribution/Contributions.vue";
import Orders from "@/views/order/Orders.vue";
import Profile from "@/views/profile/Profile.vue";
import Settings from "@/views/settings/Settings.vue";
import ApplicationSettings from "@/services/application-settings";
import CreateClient from "@/views/admin/client/CreateClient.vue";
import Administration from "@/views/admin/Administration.vue";
import Users from "@/views/admin/user/Users.vue";
import User from "@/views/admin/user/User.vue";
import Clients from "@/views/admin/client/Clients.vue";
import Client from "@/views/admin/client/Client.vue";
import Contracts from "@/views/admin/contract/Contracts.vue";
import Teams from "@/views/admin/team/Teams.vue";
import Team from "@/views/admin/team/Team.vue";
import Softwares from "@/views/admin/software/Softwares.vue";
import Contract from "@/views/admin/contract/Contract.vue";
import AdminContributions from "@/views/admin/contribution/Contributions.vue";
import EditContract from "@/views/admin/contract/EditContract.vue";
import AdministrationHome from "@/views/admin/Home.vue";

Vue.use(Router);

// Set your routes here
export const routeNames = Object.freeze({
  HOME: "Home",
  CREATEREQUEST: "New issue",
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
  ADMINHOME: "AdministrationHome",
  USERS: "Users",
  CLIENTS: "Clients",
  SOFTWARES: "Softwares",
  CONTRACTS: "Contracts",
  CONTRACT: "Contract",
  ADMINCONTRIBUTIONS: "AdminContributions",
  EDITCONTRACT: "Edit Contract",
  TEAMS: "Teams",
  USER: "User",
  CLIENT: "Client",
  TEAM: "Team"
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
      component: Administration,
      name: routeNames.ADMINISTRATION,
      meta: {
        auth: true
      },
      children: [
        {
          path: "",
          name: routeNames.ADMINHOME,
          component: AdministrationHome,
          meta: {
            auth: true
          }
        },
        {
          path: "users",
          name: routeNames.USERS,
          component: Users,
          meta: {
            auth: true
          }
        },
        {
          path: "users/:id",
          name: routeNames.USER,
          component: User,
          meta: {
            auth: true
          }
        },
        {
          path: "teams",
          name: routeNames.TEAMS,
          component: Teams,
          meta: {
            auth: true
          }
        },
        {
          path: "teams/:id",
          name: routeNames.TEAM,
          component: Team,
          meta: {
            auth: true
          }
        },
        {
          path: "Softwares",
          name: routeNames.SOFTWARES,
          component: Softwares,
          meta: {
            auth: true
          }
        },
        {
          path: "clients",
          name: routeNames.CLIENTS,
          component: Clients,
          meta: {
            auth: true
          }
        },
        {
          path: "clients/:id",
          name: routeNames.CLIENT,
          component: Client,
          meta: {
            auth: true
          }
        },
        {
          path: "admincontributions",
          name: routeNames.ADMINCONTRIBUTIONS,
          component: AdminContributions,
          meta: {
            auth: true
          }
        },
        {
          path: "contracts",
          name: routeNames.CONTRACTS,
          component: Contracts,
          meta: {
            auth: true
          }
        },
        {
          path: "contracts/:id",
          name: routeNames.CONTRACT,
          component: Contract,
          meta: {
            auth: true
          }
        },
        {
          path: "contracts/:id/edit/:section",
          name: routeNames.EDITCONTRACT,
          component: EditContract,
          meta: {
            auth: true
          }
        }
      ]
    }
  ]
});
