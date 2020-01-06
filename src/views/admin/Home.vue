<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title>
            <v-badge left>
              <template v-slot:badge>
                <span>{{ userCount }}</span>
              </template>
              <div>
                <h3 class="headline mb-0">
                  <v-icon x-large>people</v-icon>
                  {{ $t("Users") }}
                </h3>
              </div>
            </v-badge>
            <v-spacer></v-spacer>
            <v-btn icon fab :to="{ name: routeNames.USERS }">
              <v-icon>list</v-icon>
            </v-btn>
            <v-btn icon fab :to="{ name: routeNames.NEWUSER }">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title>
            <v-badge left>
              <template v-slot:badge>
                <span>{{ teamCount }}</span>
              </template>
              <div>
                <h3 class="headline mb-0">
                  <v-icon x-large>people_outline</v-icon>
                  {{ $t("Teams") }}
                </h3>
              </div>
            </v-badge>
            <v-spacer></v-spacer>
            <v-btn icon fab :to="{ name: routeNames.TEAMS }">
              <v-icon>list</v-icon>
            </v-btn>
            <v-btn icon fab :to="{ name: routeNames.NEWTEAM }">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title>
            <v-badge left>
              <template v-slot:badge>
                <span>{{ clientCount }}</span>
              </template>
              <div>
                <h3 class="headline mb-0">
                  <v-icon x-large>account_box</v-icon>
                  {{ $t("Clients") }}
                </h3>
              </div>
            </v-badge>
            <v-spacer></v-spacer>
            <v-btn icon fab :to="{ name: routeNames.CLIENTS }">
              <v-icon>list</v-icon>
            </v-btn>
            <v-btn icon fab :to="{ name: routeNames.NEWCLIENT }">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title>
            <v-badge left>
              <template v-slot:badge>
                <span>{{ contractCount }}</span>
              </template>
              <div>
                <h3 class="headline mb-0">
                  <v-icon x-large>assignment</v-icon>
                  {{ $t("Contracts") }}
                </h3>
              </div>
            </v-badge>
            <v-spacer></v-spacer>
            <v-btn icon fab :to="{ name: routeNames.CONTRACTS }">
              <v-icon>list</v-icon>
            </v-btn>
            <v-btn icon fab :to="{ name: routeNames.NEWCONTRACT }">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title>
            <v-badge left>
              <template v-slot:badge>
                <span>{{ softwareCount }}</span>
              </template>
              <div>
                <h3 class="headline mb-0">
                  <v-icon x-large>web</v-icon>
                  {{ $t("Softwares") }}
                </h3>
              </div>
            </v-badge>
            <v-spacer></v-spacer>
            <v-btn icon fab :to="{ name: routeNames.SOFTWARELIST }">
              <v-icon>list</v-icon>
            </v-btn>
            <v-btn icon fab :to="{ name: routeNames.NEWSOFTWARE }">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title>
            <v-badge left>
              <template v-slot:badge>
                <span>{{ contributionCount }}</span>
              </template>
              <div>
                <h3 class="headline mb-0">
                  <v-icon x-large>library_add</v-icon>
                  {{ $t("Contributions") }}
                </h3>
              </div>
            </v-badge>
            <v-spacer></v-spacer>
            <v-btn icon fab :to="{ name: routeNames.ADMINCONTRIBUTIONS }">
              <v-icon>list</v-icon>
            </v-btn>
            <v-btn icon fab :to="{ name: routeNames.NEWCONTRIBUTION }">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title>
            <h3 class="headline mb-0">
              <v-icon x-large>verified_user</v-icon>
              {{ $t("Roles") }}
            </h3>
            <v-spacer></v-spacer>
            <v-btn icon fab :to="{ name: routeNames.ADMIN_ROLES }">
              <v-icon>build</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { routeNames } from "@/router";
export default {
  data() {
    return {
      msg: this.$i18n.t("Administration"),
      users: [],
      teams: [],
      contracts: [],
      clients: [],
      contributions: [],
      softwares: [],
      userCount: 0,
      teamCount: 0,
      softwareCount: 0,
      clientCount: 0,
      contractCount: 0,
      contributionCount: 0
    };
  },
  mounted() {
    this.$http
      .listUsers()
      .then(response => {
        this.users = response.data;
        this.userCount = response.data.length;
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch users"),
          color: "error"
        });
      });

    this.$http
      .listTeam()
      .then(response => {
        this.teams = response.data;
        this.teamCount = response.data.length;
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch teams"),
          color: "error"
        });
      });

    this.$http
      .listClients()
      .then(response => {
        this.clients = response.data;
        this.clientCount = response.data.length;
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch clients"),
          color: "error"
        });
      });

    this.$http
      .getContracts()
      .then(response => {
        this.contracts = response.data;
        this.contractCount = response.data.length;
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch contracts"),
          color: "error"
        });
      });

    this.$http
      .listSoftware({})
      .then(response => {
        this.softwares = response.data;
        this.softwareCount = response.data.length;
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch softwares"),
          color: "error"
        });
      });
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  },
  computed: {
    routeNames() {
      return routeNames;
    }
  }
};
</script>

<style lang="stylus" scoped>
.v-card__title--primary {
  cursor: pointer;

  .v-icon {
    padding-right: 10px;
    color: rgba(0, 0, 0, 0.87);
  }
}

.v-card {
  ul {
    margin-left: 30px;
  }
}

li {
  padding-top: 24px !important;
}

.custom-btn-action {
  padding-top: 9px !important;
  margin-right: auto !important;
  margin-left: auto !important;
  display: block !important;
  width: 50%;
}

.v-card__actions {
  padding-top: 30px !important;
}
</style>
