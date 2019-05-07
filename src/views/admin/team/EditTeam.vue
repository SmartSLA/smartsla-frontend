<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Teams' }"
      >&lt; {{ $t("Return to teams list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <div>
              <h3 class="display-1 font-weight-medium mb-0">{{ isNew ? $t("Edit Team") : $t("New Team") }}</h3>
            </div>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Name") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="team.name"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Motto") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="team.motto"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Email") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="team.email"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Manager") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-select :items="expertUsers" item-text="name" item-value="name"></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Members") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-autocomplete
                :items="users"
                item-text="name"
                item-value="name"
                background-color="white"
                :search-input.sync="member"
                multiple
              ></v-autocomplete>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Alert system active") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-switch v-model="team.alertActive"></v-switch>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Hash") }} :</strong>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model="team.hash"></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-btn class="primary" @click.native="generateHash">{{ $t("Generate Hash") }}</v-btn>
            </v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Test alert system active") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-switch v-model="team.testAlertActive"></v-switch>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Automatic Alert : Starting hour") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-menu
                ref="menu1"
                v-model="startTime"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time1"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="time1"
                    label="Picker in menu"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="startTime"
                  v-model="time1"
                  full-width
                  @click:minute="$refs.menu1.save(time1)"
                ></v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Automatic Alert : Automatic starting hour") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-menu
                ref="menu2"
                v-model="endTime"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time2"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="time2"
                    label="Picker in menu"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="endTime"
                  v-model="time2"
                  full-width
                  @click:minute="$refs.menu2.save(time2)"
                ></v-time-picker>
              </v-menu>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Team contracts") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-autocomplete
                :items="team.contracts"
                item-text="name"
                item-value="name"
                background-color="white"
                :search-input.sync="contract"
                multiple
              ></v-autocomplete>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5></v-flex>
            <v-flex xs5>
              <v-btn class="success">{{ $t("validate") }}</v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
var hash = require("hash-sum");
export default {
  data() {
    return {
      member: "",
      users: {},
      expertUsers: {},
      clients: {},
      contract: "",
      contracts: {},
      time1: "",
      time2: "",
      startTime: "",
      endTime: "",
      team: {
        members: [],
        type: "",
        hash: "",
        name: "",
        email: "",
        contracts: "",
        client: "",
        role: "",
        identifier: "",
        phone: "",
        title: ""
      }
    };
  },
  computed: {
    isNew() {
      return this.$route.params.id;
    }
  },
  methods: {
    generateHash() {
      this.team.hash = (+new Date()).toString(36);
    }
  },
  created() {
    if (this.$route.params.id) {
      this.team = require("@/assets/data/team.json");
    }
    this.clients = require("@/assets/data/clients.json");
    this.contracts = require("@/assets/data/contracts.json");
    this.users = require("@/assets/data/users.json");
    this.expertUsers = require("@/assets/data/users.json");
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "teams");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    this.$store.dispatch("sidebar/resetAdminMenu");

    next();
  }
};
</script>
<style lang="stylus" scoped>
.action-links {
  text-decoration: none;
  color: grey;
  cursor: pointer;
}
</style>
