<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <div>
              <h3 class="display-1 font-weight-medium mb-0">{{ $t("New user") }}</h3>
            </div>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout row wrap>
              <v-flex xs3 class="pt-4">
                <span class="title">{{ $t("Type") }}</span>
              </v-flex>
              <v-flex xs8>
                <v-radio-group v-model="user.type" row color="primary">
                  <v-radio :label="$t('Beneficiary')" value="beneficiary"></v-radio>
                  <v-radio :label="$t('Expert')" value="expert"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <span class="title">{{ $t("Search users") }}</span>
              </v-flex>
              <v-flex xs8>
                 <v-autocomplete
                  v-model="member"
                  :items="items"
                  :loading="isLoading"
                  :search-input.sync="search"
                  chips
                  deletable-chips
                  item-text="name"
                  item-value="name"
                  :label="$t('Users')"
                  cache-items
                  return-object
                >
                  <template slot="no-data">
                    <v-list-tile>
                      <v-list-tile-title>
                        {{ $t("Please refine your search...") }}
                      </v-list-tile-title>
                    </v-list-tile>
                  </template>

                  <template slot="selection" slot-scope="data">
                    <v-chip :selected="data.selected">
                    {{ data.item.name }}
                    </v-chip>
                  </template>

                  <template slot="item" slot-scope="data">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="data.item.name"></v-list-tile-title>
                    </v-list-tile-content>
                  </template>
                 </v-autocomplete>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <span class="title required-label">{{ $t("Name") }}</span>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="user.name"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <span class="title required-label">{{ $t("Email") }}</span>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="user.email"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <span class="title required-label">{{ $t("Role") }}</span>
              </v-flex>
              <v-flex xs8>
                <v-radio-group
                  v-model="user.role"
                  row
                  color="primary"
                  :rules="[() => user.role.length > 0 || $i18n.t('Required field')]"
                >
                  <v-radio :label="$t('Customer')" value="customer" v-if="user.type === 'beneficiary'"></v-radio>
                  <v-radio :label="$t('Viewer')" value="viewer" v-if="user.type === 'beneficiary'"></v-radio>
                  <v-radio :label="$t('Manager')" value="manager" v-if="user.type === 'expert'"></v-radio>
                  <v-radio :label="$t('Expert')" value="expert" v-if="user.type === 'expert'"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4" v-if="user.type !== 'expert'">
                <span class="title">{{ $t("Client") }}</span>
              </v-flex>
              <v-flex xs8 v-if="user.type !== 'expert'">
                <v-select
                  :items="clientsList"
                  item-value="_id"
                  item-text="name"
                  v-model="user.client"
                ></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4" v-if="user.type !== 'expert'">
                <span class="title">{{ $t("Contracts") }}</span>
              </v-flex>
              <v-flex xs8 v-if="user.type !== 'expert'">
                <v-select
                  :items="contractList"
                  item-value="_id"
                  item-text="name"
                  multiple
                  v-model="user.contracts"
                ></v-select>
              </v-flex>
              <v-flex xs12 offset-xs5>
                <v-btn class="success" @click="validateFrom">{{ $t("Create") }}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
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
      member: null,
      isLoading: false,
      items: [],
      search: null,
      clientsList: [],
      contractList: [],
      valid: true,
      user: {
        type: "",
        name: "",
        email: "",
        contracts: "",
        client: "",
        role: ""
      },
      openDialog: false
    };
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "users");
    this.fetchData();
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    this.$store.dispatch("sidebar/resetAdminMenu");

    next();
  },
  watch: {
    member(value) {
      this.user.name = value ? value.name : "";
      this.user.email = value ? value.email : "";
    },
    search(val) {
      if (!val || val === null) {
        return;
      }
      this.isLoading = true;
      this.$http.searchPeople(val)
        .then(results => results.map(person => ({
          name: person.names[0].displayName,
          email: person.emailAddresses[0].value
        })))
        .then(results => (this.items = results))
        .catch(console.log)
        .finally(() => (this.isLoading = false));
    }
  },
  methods: {
    fetchData() {
      return Promise.all([this.getContracts(), this.getClients()]);
    },
    createUser() {
      this.$http
        .createUser(this.user)
        .then(response => {
          if (response.data && response.status === 201) {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("User created"),
              color: "success"
            });
            this.user = {};
          }
          this.$router.push({ name: routeNames.USERS });
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
        this.createUser();
      } else {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("the required fields must be filled"),
          color: "error"
        });
      }
    },

    getContracts() {
      this.$http
        .getContracts()
        .then(response => (this.contractList = response.data || []))
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("failed to fetch contracts list"),
            color: "error"
          });
        });
    },

    getClients() {
      this.$http
        .listClients()
        .then(response => (this.clientsList = response.data || []))
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: "cannot fetch clients",
            color: "error"
          });
        });
    }
  }
};
</script>
