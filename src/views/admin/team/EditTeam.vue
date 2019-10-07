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
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout row wrap>
              <v-flex xs3 class="pt-4">
                <strong class="required-label">{{ $t("Name") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="team.name"
                  :rules="[() => team.name.length > 0 || $i18n.t('Required field')]"
                ></v-text-field>
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
                      :label="$i18n.t('Picker in menu')"
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
                      :label="$i18n.t('Picker in menu')"
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
                <strong>{{ $t("Contracts") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-autocomplete
                  :items="contracts"
                  item-text="name"
                  item-value="name"
                  background-color="white"
                  multiple
                ></v-autocomplete>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs5></v-flex>
              <v-flex xs5>
                <v-btn class="success" @click="validateFrom">{{ $t("validate") }}</v-btn>
                <v-btn color="error" @click="openDialog = true" v-if="isNew">{{ $t("Delete") }}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
          <v-dialog v-model="openDialog" persistent max-width="290">
            <v-card>
              <v-card-title class="body-2">{{ $t("You are about to delete:") }}</v-card-title>
              <v-card-text>
                <span class="pl-3">{{ $t("Team") }} : {{ team.name }}</span>
                <br />
                <br />
                <span class="body-2">{{ $t("is linked to the following elements") }}</span>
                <br />-
                <br />
                <span class="body-2">{{ $t("Are you sure?") }}</span>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" flat @click="openDialog = false">close</v-btn>
                <v-btn color="error darken-1" flat @click="deleteTeam">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      openDialog: false,
      member: "",
      valid: true,
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
    },

    createTeam() {
      this.$http
        .createTeam(this.team)
        .then(response => {
          if (response.data && response.status === 201) {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("Team created"),
              color: "success"
            });
            this.team = {};
          }
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },

    validateFrom() {
      if (this.$refs.form.validate()) {
        this.createTeam();
      } else {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("the required fields must be filled"),
          color: "error"
        });
      }
    },

    deleteTeam() {
      this.$http
        .deleteTeam(this.team._id)
        .then(response => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("team deleted"),
            color: "success"
          });
          this.$router.push({ name: routeNames.TEAMS });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    }
  },
  created() {
    if (this.$route.params.id) {
      this.$http
        .getTeamById(this.$route.params.id)
        .then(response => {
          this.team = response.data;
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: "failed to fetch team",
            color: "error"
          });
        });
    }
    this.clients = require("@/assets/data/clients.json");
    this.contracts = require("@/assets/data/contracts.json");
    this.users = require("@/assets/data/users.json");
    this.expertUsers = require("@/assets/data/users.json");
  }
};
</script>
<style lang="stylus" scoped>
.action-links {
  text-decoration: none;
  color: grey;
  cursor: pointer;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat):not(.error) {
  background-color: #2195f2 !important;
}

.container {
  max-width: 100% !important;
  padding: 0px;
}

.pt-0 {
  margin-right: 0px !important;
  margin-left: 0px !important;
  padding-right: 0px;
  margin-top: 0px !important;
}
@media only screen and (min-width: 1264px) {
  .container {
  max-width: 100% !important;
  padding-right: 24px;
}
}
</style>
