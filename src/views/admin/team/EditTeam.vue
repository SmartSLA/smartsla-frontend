<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
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
                  :rules="[() => (team.name && !!team.name) || $i18n.t('Required field')]"
                ></v-text-field>
              </v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Email") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-text-field v-model="team.email"></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("manager") }} :</strong>
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
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Contracts") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-autocomplete :items="contracts" item-text="name" item-value="name" multiple></v-autocomplete>
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
import { USER_TYPE } from "@/constants.js";
import { routeNames } from "@/router";
import { cloneDeep } from "lodash";

export default {
  metaInfo() {
    return {
      title: this.isNew ? `${this.$i18n.t("Edit Team")} - ${this.client.name}` : this.$i18n.t("New Team")
    };
  },
  data() {
    return {
      openDialog: false,
      member: "",
      valid: true,
      users: {},
      contract: "",
      contracts: {},
      team: {
        members: [],
        type: "",
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
    },

    expertUsers() {
      return this.$store.getters["users/getUsersByType"](USER_TYPE.EXPERT);
    }
  },
  methods: {
    createTeam() {
      this.$store
        .dispatch("team/createTeam", this.team)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Team created"),
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
      this.$store
        .dispatch("team/deleteTeam", this.team._id)
        .then(() => {
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
      const { id } = this.$route.params;
      this.$store.dispatch("team/fetchTeamById", id).then(() => {
        const team = this.$store.getters["team/getTeamById"](id);
        this.team = cloneDeep(team);
      });
    }

    this.$store.dispatch("users/fetchUsers");

    this.$http
      .getContracts()
      .then(({ data }) => {
        this.contracts = data;
      })
      .catch(console.log); // eslint-disable-line no-console
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
