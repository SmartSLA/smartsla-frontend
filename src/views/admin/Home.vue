<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex v-for="card in cards" :key="card.name" xs12 sm6 md4 lg4 xl4>
        <v-card hover>
          <v-card-title class="pb-0">
            <v-icon :size="40" :color="card.icon.color">
              {{ card.icon.value }}
            </v-icon>
            <v-spacer></v-spacer>
            <v-card-title>
              <v-layout column align-end>
                <span class="grey--text title">
                  {{ $t(card.name) }}
                </span>
                <span v-if="card.count != undefined" class="display-1 pr-4">
                  {{ card.count }}
                </span>
              </v-layout>
            </v-card-title>
          </v-card-title>
          <v-divider class="mx-3"></v-divider>
          <v-card-actions class="py-3">
            <v-layout justify-end>
              <v-btn v-if="card.actions.list" small flat :to="{ name: card.actions.list }">
                <v-icon>list</v-icon>
                <div>list</div>
              </v-btn>
              <v-btn v-if="card.actions.add" small flat :to="{ name: card.actions.add }">
                <v-icon>add</v-icon>
                <div>create</div>
              </v-btn>
              <v-btn v-if="card.actions.roles" small flat :to="{ name: card.actions.roles }">
                <v-icon small>build</v-icon>
                <div>edit</div>
              </v-btn>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { routeNames } from "@/router";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      msg: this.$i18n.t("Administration"),
      teams: [],
      contributions: [],
      contractCount: 0
    };
  },
  mounted() {
    this.$store.dispatch("contribution/countContributions");
    this.$store.dispatch("software/countSoftware");
    this.$store.dispatch("client/countClients");
    this.$store.dispatch("users/fetchUsers");
    this.$store.dispatch("team/countTeams");
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  },
  computed: {
    ...mapGetters({
      contracts: "contract/getContracts",
      softwareCount: "software/getSoftwareCount",
      clientCount: "client/getClientsCount",
      userCount: "users/getUsersCount",
      teamCount: "team/getTeamsCount"
    }),

    contributionCount() {
      return this.$store.getters["contribution/getContributionsCount"];
    },

    cards() {
      return [
        {
          name: "Users",
          count: this.userCount,
          icon: {
            color: "",
            value: "people"
          },
          actions: {
            add: this.routeNames.NEWUSER,
            list: this.routeNames.USERS
          }
        },
        {
          name: "Teams",
          count: this.teamCount,
          icon: {
            color: "",
            value: "people_outline"
          },
          actions: {
            add: this.routeNames.NEWTEAM,
            list: this.routeNames.TEAMS
          }
        },
        {
          name: "Clients",
          count: this.clientCount,
          icon: {
            color: "warning",
            value: "account_box"
          },
          actions: {
            add: this.routeNames.NEWCLIENT,
            list: this.routeNames.CLIENTS
          }
        },
        {
          name: "Contracts",
          count: this.contracts.length,
          icon: {
            color: "error",
            value: "assignment"
          },
          actions: {
            add: this.routeNames.NEWCONTRACT,
            list: this.routeNames.CONTRACTS
          }
        },
        {
          name: "Softwares",
          count: this.softwareCount,
          icon: {
            color: "primary",
            value: "web"
          },
          actions: {
            add: this.routeNames.NEWSOFTWARE,
            list: this.routeNames.SOFTWARELIST
          }
        },
        {
          name: "Contributions",
          count: this.contributionCount,
          icon: {
            color: "secondary",
            value: "library_add"
          },
          actions: {
            add: this.routeNames.NEWCONTRIBUTION,
            list: this.routeNames.CONTRIBUTIONS
          }
        },
        {
          name: "Roles",
          icon: {
            color: "success",
            value: "verified_user"
          },
          actions: {
            roles: this.routeNames.ADMIN_ROLES
          }
        }
      ];
    },
    routeNames() {
      return routeNames;
    }
  }
};
</script>
