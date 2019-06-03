<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Users' }"
      >&lt; {{ $t("Return to users list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <div>
              <h3 class="display-1 font-weight-medium mb-0">{{ isNew ? $t("Edit User") : $t("New user") }}</h3>
            </div>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Type") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-radio-group v-model="user.type" row color="primary">
                <v-radio :label="$t('Beneficiary')" value="beneficiary"></v-radio>
                <v-radio :label="$t('Expert')" value="expert"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Name") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="user.name"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Position") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="user.title"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Email") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="user.email"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Phone") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="user.phone"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Identifier") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="user.identifier"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Role") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-radio-group v-model="user.role" row color="primary">
                <v-radio :label="$t('Customer')" value="customer" v-if="user.type == 'beneficiary'"></v-radio>
                <v-radio :label="$t('Viewer')" value="viewer" v-if="user.type == 'beneficiary'"></v-radio>
                <v-radio :label="$t('Manager')" value="manager" v-if="user.type == 'expert'"></v-radio>
                <v-radio :label="$t('Expert')" value="expert" v-if="user.type == 'expert'"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4" v-if="user.type != 'expert'">
              <strong>{{ $t("Client") }} :</strong>
            </v-flex>
            <v-flex xs8 v-if="user.type != 'expert'">
              <v-select :items="clients" item-value="name" item-text="name" v-model="user.client"></v-select>
            </v-flex>
            <v-flex xs1 v-if="user.type != 'expert'"></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("contracts") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-select
                :items="contracts"
                item-value="name"
                item-text="name"
                multiple
                v-model="user.contracts"
              ></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5></v-flex>
            <v-flex xs2>
              <v-btn class="success" @click="createUser">
                {{ $t("validate") }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      clients: {},
      contracts: {},
      user: {
        type: "",
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
  created() {
    if (this.$route.params.id) {
      this.user = require("@/assets/data/user.json");
    }
    this.clients = require("@/assets/data/clients.json");
    this.contracts = require("@/assets/data/contracts.json");
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "users");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    this.$store.dispatch("sidebar/resetAdminMenu");

    next();
  },
  methods: {
    createUser() {
      this.$http
        .createUser(this.user)
        .then(response => {
          if (response.data && response.status === 201) {
            this.$store.dispatch("ui/displaySnackbar", { message: this.$i18n.t("User created"), color: "success" });
            this.user = {};
          }
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", { message: error.response.data.error.details, color: "error" });
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
div.flex.pt-4.xs2 strong
  word-wrap: break-word;
.action-links
  text-decoration: none;
  color: grey;
  cursor: pointer;
</style>