<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Users' }"
      >&lt; {{ $t("Return to users list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs8>
        <v-card class="px-1 mt-4 pb-4">
          <v-layout row wrap>
            <v-flex xs10>
              <v-card-title primary-title class="px-4">
                <div>
                  <h3 class="display-1 font-weight-medium mb-0">{{ user.name }}</h3>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs2>
              <div class="text-xs-right grey--text pt-3">
                <v-btn color="primary" fab small dark :to="{ name: 'UserEdit', params: { id: 15 } }">
                  <v-icon>edit</v-icon>
                </v-btn>
              </div>
            </v-flex>
          </v-layout>

          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap class="pt-4 px-4">
            <v-flex xs6>
              <v-layout row wrap>
                <v-flex xs12>
                  <strong>{{ $t("Type") }} :</strong>
                  {{ $t(user.type) }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Name") }} :</strong>
                  {{ user.name }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Position") }} :</strong>
                  {{ user.title }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Email") }} :</strong>
                  {{ user.email }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Phone") }} :</strong>
                  {{ user.phone }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Team") }} :</strong>
                  {{ user.team }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Identifier") }} :</strong>
                  {{ user.identifier }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Role") }} :</strong>
                  {{ user.role }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2></v-flex>
            <v-flex xs4>
              <v-layout row wrap>
                <v-flex xs12>
                  <img :src="user.client.image" height="100" />
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Client") }} :</strong>
                  {{ user.client.name }}
                </v-flex>
                <v-flex xs12>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <strong>{{ $t("Contracts") }} :</strong>
                    </v-flex>
                    <v-flex xs8>
                      <ul>
                        <li v-for="(contract, key) in user.contracts" :key="key">
                          <router-link :to="{ name: 'Contract', params: { id: 15 } }">{{ contract.name }}</router-link>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs4></v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      user: {}
    };
  },
  created() {
    this.user = require("@/assets/data/user.json");
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "users");
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

.container {
  max-width: 100% !important;
  padding: 0px;
}
</style>
