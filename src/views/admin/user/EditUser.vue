<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card class="px-4 mt-4 pb-4">
          <v-card-title primary-title class="px-4">
            <div>
              <h3 class="display-1 font-weight-medium mb-0">{{ isEdit ? $t("Edit User") : $t("New user") }}</h3>
            </div>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout row wrap>
              <v-flex xs3 class="pt-4">
                <strong class="required-label">{{ $t("Type") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-radio-group
                  v-model="user.type"
                  row
                  color="primary"
                  @change="initRole"
                  :disabled="!isAdmin"
                  :rules="[() => (user.type && user.type.length > 0) || $i18n.t('Required field')]"
                >
                  <v-radio :label="$t('Beneficiary')" value="beneficiary"></v-radio>
                  <v-radio :label="$t('Expert')" value="expert"></v-radio>
                </v-radio-group>
                <label class="v-label theme--light" v-if="user.type === 'beneficiary'">{{
                  $t("Beneficiary is a customer linked to a client and can create, see tickets")
                }}</label>
                <label class="v-label theme--light" v-if="user.type === 'expert'">{{
                  $t("Expert is part of the team handling the ticket")
                }}</label>
              </v-flex>
              <v-flex xs1 v-if="!isEdit"></v-flex>
              <v-flex xs3 class="pt-4" v-if="!isEdit">
                <span class="title required-label">{{ $t("Search users") }}</span>
              </v-flex>
              <v-flex xs8 v-if="!isEdit">
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
                  :rules="[() => (member && !!Object.keys(member)) || $i18n.t('Required field')]"
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
                <strong class="required-label">{{ $t("Name") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="user.name"
                  :rules="[() => (user.name && user.name.length > 0) || $i18n.t('Required field')]"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong class="required-label">{{ $t("Email") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="user.email"
                  :rules="[() => /.+@.+/.test(user.email) || $i18n.t('email required')]"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Phone") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-text-field v-model="user.phone" disabled></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Job title") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-text-field v-model="user.jobTitle"></v-text-field>
              </v-flex>

              <v-flex xs1 v-if="user.type !== 'expert'"></v-flex>
              <v-flex xs3 class="pt-4" v-if="user.type !== 'expert'">
                <strong>{{ $t("Responsible of the contract") }} :</strong>
              </v-flex>
              <v-flex xs8 v-if="user.type !== 'expert'">
                <v-checkbox
                  :label="$t('contract manager')"
                  v-model="isContractManager"
                  :value="user.role === 'contract manager'"
                ></v-checkbox>
              </v-flex>

              <v-flex xs1 v-if="user.type === 'expert'"></v-flex>
              <v-flex xs3 class="pt-4" v-if="user.type === 'expert'">
                <strong>{{ $t("Roles") }} :</strong>
              </v-flex>
              <v-flex xs8 v-if="user.type === 'expert'">
                <v-radio-group
                  v-model="user.role"
                  row
                  color="primary"
                  :disabled="!isAdmin"
                  :rules="[() => (user.role && user.role.length > 0) || $i18n.t('Required field')]"
                >
                  <v-radio
                    v-for="role in rolesExpert"
                    :key="role"
                    :label="$t(role)"
                    :value="role"
                    @change="resetSelectedContracts"
                  ></v-radio>
                </v-radio-group>
                <label class="v-label theme--light" v-if="user.role === 'expert'">{{
                  $t("Expert role can see all tickets")
                }}</label>
                <label class="v-label theme--light" v-if="user.role === 'manager'">{{
                  $t("Admin role can see all tickets and administrate")
                }}</label>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4" v-if="user.type != 'expert'">
                <strong class="required-label">{{ $t("Client") }} :</strong>
              </v-flex>
              <v-flex xs8 v-if="user.type != 'expert'">
                <v-select
                  :items="clientsList"
                  item-value="_id"
                  item-text="name"
                  v-model="user.client"
                  :disabled="!isAdmin"
                  :rules="[() => !!user.client || $i18n.t('Required field')]"
                ></v-select>
              </v-flex>
              <v-flex xs1 v-if="user.type != 'expert'"></v-flex>
              <v-flex xs3 class="pt-4 hidden-xs-only" v-if="showContracts">
                <strong>{{ $t("Contracts") }} :</strong>
              </v-flex>
              <v-flex xs12 sm8 md8 lg8 v-if="showContracts">
                <v-card>
                  <v-list subheader two-line :disabled="!isAdmin">
                    <v-list-tile v-for="contract in filteredContractsByClient" :key="contract._id">
                      <v-flex xs2 sm2 md1 lg1>
                        <v-list-tile-action>
                          <v-checkbox
                            v-model="contract.selected"
                            color="success"
                            @change="handleMultipleContractSelection(contract._id)"
                          ></v-checkbox>
                        </v-list-tile-action>
                      </v-flex>
                      <v-flex xs5 sm6 md5 lg7>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ contract.name }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ contract.client }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-flex>
                      <v-flex xs6 sm4 md8 lg4 px-0>
                        <v-list-tile-action>
                          <v-select dense :items="contractRoles" :label="$t('Role')" v-model="contract.role"></v-select>
                        </v-list-tile-action>
                      </v-flex>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>

              <v-flex xs12 offset-xs5>
                <v-btn class="success" @click="validateFrom">
                  {{ isEdit ? $t("validate") : $t("Create") }}
                </v-btn>
                <v-btn color="error" @click="openDialog = true" v-if="isEdit">{{ $t("Delete") }}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
          <v-dialog v-model="openDialog" persistent max-width="290">
            <v-card>
              <v-card-title class="body-2">{{ $t("You are about to delete:") }}</v-card-title>
              <v-card-text>
                <span class="pl-3">{{ $t("User") }} : {{ user.name }}</span>
                <br />
                <br />
                <span class="body-2">
                  {{ $t("Are you sure?") }}
                </span>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" flat @click="openDialog = false">close</v-btn>
                <v-btn color="error darken-1" flat @click="deleteUser">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { routeNames } from "@/router";
import { USER_TYPE, USER_ROLES, BENEFICIARY_ROLE_LIST } from "@/constants.js";
import Vue from "vue";
import { mapGetters } from "vuex";
import { cloneDeep } from "lodash";

export default {
  data() {
    return {
      member: null,
      isLoading: false,
      items: [],
      search: null,
      valid: true,
      isContractManager: false,
      user: {
        type: "",
        name: "",
        email: "",
        contracts: [],
        client: "",
        role: "",
        phone: "",
        jobTitle: ""
      },
      openDialog: false,
      contractRoles: USER_ROLES.beneficiary.map(role => ({ text: this.$i18n.t(role), value: role }))
    };
  },
  watch: {
    search(val) {
      if (!val || val === null) {
        return;
      }
      this.isLoading = true;
      this.$http
        .searchPeople(val)
        .then(results =>
          results.map(person => ({
            name: person.names[0].displayName,
            email: person.emailAddresses[0].value,
            phone: person.phoneNumbers && person.phoneNumbers[0] ? person.phoneNumbers[0].value : ""
          }))
        )
        .then(results => (this.items = results))
        .catch(console.log)
        .finally(() => (this.isLoading = false));
    },
    isContractManager(val) {
      if (val) {
        this.user.role = BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER;
      } else {
        this.user.role = BENEFICIARY_ROLE_LIST.VIEWER;
      }
    },
    member: "setUser",
    "user.client": "resetUserContracts"
  },
  computed: {
    ...mapGetters({
      contractList: "contract/getContracts",
      clientsList: "client/getClients",
      currentUserId: "currentUser/getId"
    }),
    isAdmin() {
      return this.$auth.check(USER_TYPE.ADMIN);
    },
    rolesExpert() {
      return USER_ROLES.expert;
    },
    isEdit() {
      return !!this.$route.params.id;
    },
    filteredContractsByClient() {
      if (!this.user.client) return [];
      const contracts = this.contractList
        .filter(contract => contract.clientId === this.user.client)
        .map(contract => {
          Vue.set(contract, "contract_id", contract._id);
          Vue.set(contract, "selected", this.isContractUser(contract._id));
          Vue.set(contract, "role", this.getRoleByContractId(contract._id) || "viewer");
          return contract;
        });
      return contracts;
    },
    showContracts() {
      return (
        this.user.type === USER_TYPE.BENEFICIARY &&
        !!this.user.client &&
        this.user.role !== BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER
      );
    },
    isEditProfilePage() {
      return this.$route.name === routeNames.EDITPROFILE;
    },
    routeNames() {
      return routeNames;
    }
  },
  created() {
    const { id } = this.$route.params;
    this.$store.dispatch("client/fetchClients");
    if (id) {
      this.$store
        .dispatch("users/fetchUserById", id)
        .then(() => {
          const data = this.$store.getters["users/getUserById"](id);
          this.user = cloneDeep(data);
          if (this.user.contracts && !!this.user.contracts.length) {
            this.user = {
              ...this.user,
              client: this.user.contracts[0].contract.clientId,
              contracts: this.user.contracts.map(({ contract, role }) => ({
                contract: contract._id,
                role,
                selected: true
              }))
            };
          }
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Cannot fetch user"),
            color: "error"
          });
        });
    }
  },
  methods: {
    setUser(value) {
      this.user = {
        ...this.user,
        name: value.name || "",
        email: value.email || "",
        phone: value.phone || ""
      };
    },
    isContractUser(contract_id) {
      const userContracts = this.user.contracts && this.user.contracts.map(({ contract }) => contract);
      return userContracts.includes(contract_id);
    },
    getRoleByContractId(id) {
      const { role } = this.user.contracts.find(contract => contract.contract === id) || { role: "viewer" };
      return role;
    },
    initRole() {
      this.user.role = "";
      this.user.contracts = [];
    },
    updateUser() {
      let route = {};
      let contracts = this.filteredContractsByClient
        .filter(({ selected }) => selected === true)
        .map(({ contract_id, role }) => ({ contract_id, role }));

      if (this.user.role === BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER) {
        this.user.contracts = [];
      } else {
        this.user = { ...this.user, contracts };
      }

      this.$store
        .dispatch("users/updateUser", {
          userId: this.user._id,
          user: this.user
        })
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("updated"),
            color: "success"
          });
          this.currentUserId === this.$route.params.id
            ? (route = { name: routeNames.PROFILE })
            : (route = { name: routeNames.USER, params: { id: this.user.user } });

          this.$router.push(route);
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Cannot update user"),
            color: "error"
          });
        });
    },
    validateFrom() {
      if (this.$refs.form.validate()) {
        if (this.$route.params.id) {
          this.updateUser();
        } else {
          this.createUser();
        }
      } else {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("the required fields must be filled"),
          color: "error"
        });
      }
    },
    createUser() {
      if (this.isContractManager && this.user.type === USER_TYPE.BENEFICIARY) {
        this.user.role = BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER;
      }

      if (this.user.type === USER_TYPE.EXPERT || this.user.role === BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER) {
        this.user.client = "";
        this.user.contracts = [];
      } else {
        this.user.contracts = this.filteredContractsByClient
          .filter(({ selected }) => selected === true)
          .map(({ contract_id, role }) => ({ contract_id, role }));
      }

      this.$store
        .dispatch("users/createUser", this.user)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("User created"),
            color: "success"
          });
          this.user = {};
          this.$router.push({ name: routeNames.USERS });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t(error.response.data.error.details),
            color: "error"
          });
        });
    },
    deleteUser() {
      this.$store
        .dispatch("users/deleteUser", this.$route.params.id)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("User deleted"),
            color: "success"
          });
          this.$router.push({ name: routeNames.USERS });
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Can not delete user"),
            color: "error"
          });
        });
    },
    resetUserContracts(oldVal, newVal) {
      if (!!oldVal && !!newVal) {
        this.$set(this.user, "contracts", []);
      }
    },

    handleMultipleContractSelection(contractId) {
      if (this.user.role === BENEFICIARY_ROLE_LIST.OPERATIONAL_MANAGER) {
        this.contractList
          .filter(contract => contract._id !== contractId)
          .map(contract => {
            this.$set(contract, "selected", false);
          });
      }
    },

    resetSelectedContracts() {
      this.contractList.map(contract => {
        this.$set(contract, "selected", false);
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
div.flex.pt-4.xs2 strong {
  word-wrap: break-word;
}

.action-links {
  text-decoration: none;
  color: grey;
  cursor: pointer;
}

.pt-0 {
  padding-right: 0px;
  margin-right: 0px !important;
  margin-left: 0px !important;
  margin-top: 0px !important;
}

.container {
  max-width: 100% !important;
  padding: 0px;
}

@media only screen and (min-width: 1264px) {
  .container {
    max-width: 100% !important;
    padding-right: 24px;
  }
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat):not(.error) {
  background-color: #2195f2 !important;
}
</style>
