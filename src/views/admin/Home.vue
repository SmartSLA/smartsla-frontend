<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md4>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Users") }}</h3>
            </div>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }} {{usercount}}</li>
              <li>{{ $t("Last created at: ") }}{{new Date(usercreationdate).toLocaleDateString()}}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-btn color="blue-background-color white-color"><router-link :to="{ name: 'NewUser' }" class="users-actions white-color">
            <span>{{ $t("Add user") }}</span>
          </router-link></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Teams") }}</h3>
            </div>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }}{{teamcount}}</li>
              <li>{{ $t("Last created at: ") }}{{new Date(teamcreationdate).toLocaleDateString()}}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-btn color="blue-background-color white-color"><router-link :to="{ name: 'NewTeam' }" class="users-actions white-color">
            <span>{{ $t("Add team") }}</span>
          </router-link></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Clients") }}</h3>
            </div>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }}{{clientcount}}</li>
              <li>{{ $t("Last created at: ") }}{{new Date(clientcreationdate).toLocaleDateString()}}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-btn color="blue-background-color white-color"><router-link :to="{ name: 'NewClient' }" class="users-actions white-color">
            <span>{{ $t("Add client") }}</span>
          </router-link></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Contracts") }}</h3>
            </div>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }}{{contractcount}}</li>
              <li>{{ $t("Last created at: ") }}{{new Date(contractcreationdate).toLocaleDateString()}}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-btn color="blue-background-color white-color"><router-link :to="{ name: 'NewContract' }" class="users-actions white-color">
            <span>{{ $t("Add contract") }}</span>
          </router-link></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Softwares") }}</h3>
            </div>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }}{{softwarecount}}</li>
              <li>{{ $t("Last created at: ") }}{{new Date(softwarecreationdate).toLocaleDateString()}}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-btn color="blue-background-color white-color"><router-link :to="{ name: 'NewSoftware' }" class="users-actions white-color">
            <span>{{ $t("Add software") }}</span>
          </router-link></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ $t("Contributions") }}</h3>
            </div>
          </v-card-title>
          <div>
            <ul>
              <li>{{ $t("Total number: ") }}{{contributioncount}}</li>
              <li>{{ $t("Last created at: ") }}{{new Date(contributioncreationdate).toLocaleDateString()}}</li>
            </ul>
          </div>
          <v-card-actions>
            <v-btn color="blue-background-color white-color"><router-link :to="{ name: 'NewContribution' }" class="users-actions white-color">
            <span>{{ $t("Add contribution") }}</span>
          </router-link></v-btn>
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
      teams:[],
      contracts: [],
      clients:[],
      contributions:[],
      softwares:[],
      usercount:0,
      teamcount:0,
      softwarecount:0,
      clientcount:0,
      contractcount:0,
      contributioncount:0,
      usercreationdate:"",
      teamcreationdate:"",
      softwarecreationdate:"",
      contractcreationdate:"",
      clientcreationdate:"",
      contributioncreationdate:"",


    };
  },
  mounted() {
    this.$http
      .listUsers()
      .then(response => {
        this.users = response.data;
        this.usercount=response.data.length;
        this.usercreationdate=new Date();
        this.usercreationdate=response.data.slice(-1)[0].timestamps.creation;
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
        this.teamcount=response.data.length;
        this.teamcreationdate=response.data.slice(-1)[0].timestamps.creation;
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
        this.clientcount=response.data.length;
        this.clientcreationdate=response.data.slice(-1)[0].timestamps.creation;
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
        this.contractcount=response.data.length;
        this.contractcreationdate=response.data.slice(-1)[0].timestamps.creation;
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
        this.contributioncount=response.data.length;
        this.contributioncreationdate=response.data.slice(-1)[0].timestamps.creation;
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
        this.softwarecount=response.data.length;
        this.softwarecreationdate=response.data.slice(-1)[0].timestamps.creation;
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

<style lang="stylus" scoped></style>
