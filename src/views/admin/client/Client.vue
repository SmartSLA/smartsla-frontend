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
                  <v-btn
                    :to="{ name: 'EditClient', params: { id: this.$route.params.id } }"
                    color="primary"
                    fab
                    small
                    dark
                  >
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
                <v-flex xs12 v-if="client.image">
                  <img :src="client.image" height="100" />
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Name") }} :</strong>
                  {{ client.name }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Address") }} :</strong>
                  {{ client.address }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Unique access code") }} :</strong>
                  {{ client.accessCode }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Access code hint") }} :</strong>
                  {{ client.accessHelp }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Status") }} :</strong>
                  {{ $t(client.status) ? $t("Active") : $t("Not active") }}
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
    this.$http
      .getClientById(this.$route.params.id)
      .then(response => {
        this.client = response.data;
        this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
        this.$store.dispatch("sidebar/setActiveAdminMenu", "clients");
      })
      .catch(error => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("Failed to fetch client"),
          color: "error"
        });
      });
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

.pt-0 {
  margin-left: 0px !important;
  margin-top: 0px !important;
  margin-right: 0px !important;
}

div.wrap:nth-child(2) {
  margin-left: 0px !important;
  margin-right: 0px !important;
}

div.wrap:nth-child(2) > div:nth-child(1) {
  padding-top: 0px !important;
  padding-right: 0px !important;
  padding-left: 0px !important;
  padding-bottom: 0px !important;
}
@media only screen and (min-width: 1264px) {
  .container {
  max-width: 100% !important;
  padding-right: 24px;
}
}

.px-1 {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
</style>
