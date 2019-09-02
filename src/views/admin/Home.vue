<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md12 lg4 pr-4 pb-4>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Users") }}</h3>
            </div>
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
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Teams") }}</h3>
            </div>
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
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Clients") }}</h3>
            </div>
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
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Contracts") }}</h3>
            </div>
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
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Softwares") }}</h3>
            </div>
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
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Contributions") }}</h3>
            </div>
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
      .getContributions()
      .then(response => {
        this.contributions = response.data;
        this.contributionCount = response.data.length;
        this.contributionCreationDate = response.data.slice(-1)[0].timestamps.creation;
      })
      .catch(error => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch contributions"),
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

  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  }
};
</script>

<style lang="stylus" scoped>

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
