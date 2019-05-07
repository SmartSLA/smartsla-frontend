<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Clients' }"
      >&lt; {{ $t("Return to clients list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card class="px-1 mt-4 pb-4">
          <v-card-title primary-title class="px-2">
            <v-layout row wrap>
              <v-flex xs10>
                <v-card-title primary-title class="px-4">
                  <div>
                    <h3 class="display-1 font-weight-medium mb-0">{{ client.name }}</h3>
                  </div>
                </v-card-title>
              </v-flex>
              <v-flex xs2>
                <div class="text-xs-right grey--text pt-3">
                  <v-btn color="primary" fab small dark :to="{ name: 'EditClient', params: { id: 15 } }">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap class="pt-4 px-4">
            <v-flex xs6>
              <v-layout row wrap>
                <v-flex xs12>
                  <img :src="client.image" height="100" />
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Name") }} :</strong> {{ client.name }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Address") }} :</strong> {{ client.address }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Unique access code") }} :</strong> {{ client.accessCode }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Access code hint") }} :</strong> {{ client.codeHint }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Status") }} :</strong> {{ client.status }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs6></v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs4></v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: "client-detail",
  data() {
    return {
      client: {}
    };
  },
  created() {
    this.client = require("@/assets/data/client.json");
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "clients");
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
