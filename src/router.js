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
import EditUser from "@/views/admin/user/EditUser.vue";
import Clients from "@/views/admin/client/Clients.vue";
import Client from "@/views/admin/client/Client.vue";
import EditClient from "@/views/admin/client/EditClient.vue";
import Contracts from "@/views/admin/contract/Contracts.vue";
import Teams from "@/views/admin/team/Teams.vue";
import Team from "@/views/admin/team/Team.vue";
import EditTeam from "@/views/admin/team/EditTeam.vue";
import SoftwareList from "@/views/admin/software/Softwares.vue";
import Software from "@/views/admin/software/Software.vue";
import EditSoftware from "@/views/admin/software/EditSoftware.vue";
import Contract from "@/views/admin/contract/Contract.vue";
import AdminContributions from "@/views/admin/contribution/Contributions.vue";
import AdminContribution from "@/views/admin/contribution/Contribution.vue";
import EditContribution from "@/views/admin/contribution/EditContribution.vue";
import EditContract from "@/views/admin/contract/EditContract.vue";
import AdminRoles from "@/views/admin/roles/Main.vue";
import AdministrationHome from "@/views/admin/Home.vue";

import { requireRead } from "@/guards/ticket-guards";

Vue.use(Router);

// Set your routes here
export const routeNames = Object.freeze({
  HOME: "Home",
  CREATEREQUEST: "New issue",
  CREATECLIENT: "Create Client",
  REQUESTS: "Requests",
  REQUEST: "Request",
  EDITREQUEST: "EditRequest",
  DASHBOARD: "Dashboard",
  SATISFACTION: "Satisfaction",
  HISTORIC: "Historic",
  CONTRIBUTIONS: "Contributions",
  ORDERS: "Orders",
  PROFILE: "Profile",
  SETTINGS: "Settings",
  RESET_PASSWORD: "ResetPassword",
  LOGIN: "Login",
  ADMINISTRATION: "Administration",
  ADMINHOME: "AdministrationHome",
  USERS: "Users",
  CLIENTS: "Clients",
  SOFTWARELIST: "Softwares",
  CONTRACTS: "Contracts",
  CONTRACT: "Contract",
  ADMINCONTRIBUTIONS: "AdminContributions",
  ADMINCONTRIBUTION: "AdminContribution",
  EDITCONTRIBUTION: "EditContribution",
  NEWCONTRIBUTION: "NewContribution",
  EDITCONTRACT: "Edit Contract",
  NEWCONTRACT: "NewContract",
  TEAMS: "Teams",
  USER: "User",
  CLIENT: "Client",
  TEAM: "Team",
  EDITUSER: "UserEdit",
  NEWUSER: "NewUser",
  EDITTEAM: "TeamEdit",
  NEWTEAM: "NewTeam",
  NEWCLIENT: "NewClient",
  EDITCLIENT: "EditClient",
  EDITSOFTWARE: "EditSoftware",
  NEWSOFTWARE: "NewSoftware",
  SOFTWARE: "Software",
  ADMIN_ROLES: "AdminRoles"
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
      path: "/requests/:id",
      name: routeNames.REQUEST,
      component: Request,
      beforeEnter: requireRead,
      meta: {
        auth: true
      }
    },
    {
      path: "/requests/:id/edit",
      name: routeNames.EDITREQUEST,
      component: CreateRequest,
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
      path: "/reset-password",
      name: routeNames.RESET_PASSWORD,
      beforeEnter: () => {
        window.location.href = ApplicationSettings.SSP_URL;
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
      components: {
        default: Administration,
        sidebar: () => import("@/components/admin/AdminMainSideBar.vue")
      },
      name: routeNames.ADMINISTRATION,
      meta: {
        auth: true,
        showSideBar: true
      },
      children: [
        {
          path: "",
          name: routeNames.ADMINHOME,
          component: AdministrationHome
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
          path: "roles",
          name: routeNames.ADMIN_ROLES,
          component: AdminRoles,
          meta: {
            auth: true
          }
        },
        {
          path: "users/new",
          name: routeNames.NEWUSER,
          component: EditUser,
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
          path: "users/:id/edit",
          name: routeNames.EDITUSER,
          component: EditUser,
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
          path: "teams/new",
          name: routeNames.NEWTEAM,
          component: EditTeam,
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
          path: "teams/:id/edit",
          name: routeNames.EDITTEAM,
          component: EditTeam,
          meta: {
            auth: true
          }
        },
        {
          path: "software",
          name: routeNames.SOFTWARELIST,
          component: SoftwareList,
          meta: {
            auth: true
          }
        },
        {
          path: "software/:id",
          name: routeNames.SOFTWARE,
          component: Software,
          meta: {
            auth: true
          }
        },
        {
          path: "software/:id/edit",
          name: routeNames.EDITSOFTWARE,
          component: EditSoftware,
          meta: {
            auth: true
          }
        },
        {
          path: "software/new",
          name: routeNames.NEWSOFTWARE,
          component: EditSoftware,
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
          path: "clients/:id/edit",
          name: routeNames.EDITCLIENT,
          component: EditClient,
          meta: {
            auth: true
          }
        },
        {
          path: "clients/new",
          name: routeNames.NEWCLIENT,
          component: EditClient,
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
          path: "admincontributions/:id",
          name: routeNames.ADMINCONTRIBUTION,
          component: AdminContribution,
          meta: {
            auth: true
          }
        },
        {
          path: "admincontributions/:id/edit",
          name: routeNames.EDITCONTRIBUTION,
          component: EditContribution,
          meta: {
            auth: true
          }
        },
        {
          path: "admincontributions/new",
          name: routeNames.NEWCONTRIBUTION,
          component: EditContribution,
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
          path: "contracts/new",
          name: routeNames.NEWCONTRACT,
          component: EditContract,
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
          path: "contracts/:id/edit/:section/:type",
          name: routeNames.EDITCONTRACT,
          component: EditContract,
          meta: {
            auth: true
          }
        }
      ]
    },
    {
      path: "*",
      redirect: "/requests"
    }
  ]
});
