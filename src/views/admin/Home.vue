<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title primary-title @click.prevent="goTusers">
            <v-icon x-large>people</v-icon>
            <h3 class="headline mb-0">{{ $t("Users") }}</h3>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }} {{ userCount }}</li>
              <li>{{ $t("Last created at: ") }}{{ new Date(userCreationDate).toLocaleDateString() }}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex>
                <v-btn
                  color="blue-background-color white-color"
                  :to="{ name: 'NewUser' }"
                  class="users-actions white-color custom-btn-action"
                >
                  <span>{{ $t("Add user") }}</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title primary-title @click.prevent="goToteams">
            <v-icon x-large>people_outline</v-icon>
            <h3 class="headline mb-0">{{ $t("Teams") }}</h3>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }}{{ teamCount }}</li>
              <li>{{ $t("Last created at: ") }}{{ new Date(teamCreationDate).toLocaleDateString() }}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex>
                <v-btn
                  color="blue-background-color white-color"
                  :to="{ name: 'NewTeam' }"
                  class="users-actions white-color custom-btn-action"
                >
                  <span>{{ $t("Add team") }}</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title primary-title @click.prevent="goToclients">
            <v-icon x-large>account_box</v-icon>
            <h3 class="headline mb-0">{{ $t("Clients") }}</h3>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }}{{ clientCount }}</li>
              <li>{{ $t("Last created at: ") }}{{ new Date(clientCreationDate).toLocaleDateString() }}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex>
                <v-btn
                  color="blue-background-color white-color"
                  :to="{ name: 'NewClient' }"
                  class="users-actions white-color custom-btn-action"
                >
                  <span>{{ $t("Add client") }}</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title primary-title @click.prevent="goTocontracts">
            <v-icon x-large>assignment</v-icon>
            <h3 class="headline mb-0">{{ $t("Contracts") }}</h3>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }}{{ contractCount }}</li>
              <li>{{ $t("Last created at: ") }}{{ new Date(contractCreationDate).toLocaleDateString() }}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex>
                <v-btn
                  color="blue-background-color white-color"
                  :to="{ name: 'NewContract' }"
                  class="users-actions white-color custom-btn-action"
                >
                  <span>{{ $t("Add contract") }}</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title primary-title @click.prevent="goTosoftwares">
            <v-icon x-large>web</v-icon>
            <h3 class="headline mb-0">{{ $t("Softwares") }}</h3>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }}{{ softwareCount }}</li>
              <li>{{ $t("Last created at: ") }}{{ new Date(softwareCreationDate).toLocaleDateString() }}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex>
                <v-btn
                  color="blue-background-color white-color"
                  :to="{ name: 'NewSoftware' }"
                  class="users-actions white-color custom-btn-action"
                >
                  <span>{{ $t("Add software") }}</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title primary-title @click.prevent="goTocontributions">
            <v-icon x-large>library_add</v-icon>
            <h3 class="headline mb-0">{{ $t("Contributions") }}</h3>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }}{{ contributionCount }}</li>
              <li>{{ $t("Last created at: ") }}{{ new Date(contributionCreationDate).toLocaleDateString() }}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex>
                <v-btn
                  color="blue-background-color white-color"
                  :to="{ name: 'NewContribution' }"
                  class="users-actions white-color custom-btn-action"
                >
                  <span>{{ $t("Add contribution") }}</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
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
      contributionCount: 0,
      userCreationDate: "",
      teamCreationDate: "",
      softwareCreationDate: "",
      contractCreationDate: "",
      clientCreationDate: "",
      contributionCreationDate: ""
    };
  },
  mounted() {
    this.$http
      .listUsers()
      .then(response => {
        this.users = response.data;
        this.userCount = response.data.length;
        this.userCreationDate = response.data.slice(-1)[0].timestamps.creation;
      })
      .catch(error => {
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
        this.teamCreationDate = response.data.slice(-1)[0].timestamps.creation;
      })
      .catch(error => {
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
        this.clientCreationDate = response.data.slice(-1)[0].timestamps.creation;
      })
      .catch(error => {
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
        this.contractCreationDate = response.data.slice(-1)[0].timestamps.creation;
      })
      .catch(error => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch contracts"),
          color: "error"
        });
      });

    this.$http
      .listSoftware()
      .then(response => {
        this.softwares = response.data;
        this.softwareCount = response.data.length;
        this.softwareCreationDate = response.data.slice(-1)[0].timestamps.creation;
      })
      .catch(error => {
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
  methods: {
    goTusers() {
      return this.$router.push({ name: routeNames.USERS });
    },
    goTocontracts() {
      return this.$router.push({ name: routeNames.CONTRACTS });
    },
    goToclients() {
      return this.$router.push({ name: routeNames.CLIENTS });
    },
    goToteams() {
      return this.$router.push({ name: routeNames.TEAMS });
    },
    goTosoftwares() {
      return this.$router.push({ name: routeNames.SOFTWARELIST });
    },
    goTocontributions() {
      return this.$router.push({ name: routeNames.ADMINCONTRIBUTIONS });
    }
  }
};
</script>

<style lang="stylus" scoped>

.v-card__title--primary {
  cursor pointer;

  .v-icon {
    padding-right: 10px;
    color:rgba(0, 0, 0, 0.87);
  }
}

.v-card {
  ul {
    margin-left: 30px;
  }
}

li{
  padding-top: 24px !important;
}
.custom-btn-action{
  padding-top: 9px !important;
  margin-right: auto !important;
  margin-left: auto !important;
  display: block !important;
  width: 50%;
}
.v-card__actions{
  padding-top: 30px !important;
}
</style>
