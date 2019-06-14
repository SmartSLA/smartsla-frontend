<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Clients' }"
      >&lt; {{ $t("Return to clients list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <div>
              <h3 class="display-1 font-weight-medium mb-0">{{ isNew ? $t("Edit client") : $t("New client") }}</h3>
            </div>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Name") }} :</strong>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model="client.name"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Address") }} :</strong>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model="client.address"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Active") }} :</strong>
            </v-flex>
            <v-flex xs6>
              <v-switch v-model="client.status"></v-switch>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Logo") }} :</strong>
            </v-flex>
            <v-flex xs6>
              <file-upload
                prepend-icon="attach_file"
                class="file pt-2"
                btn-label="Attach file"
                btn-uploading-label="Uploading file"
              ></file-upload>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Access code") }} :</strong>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model="client.accessCode"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Help access") }} :</strong>
            </v-flex>
            <v-flex xs6>
              <v-text-field v-model="client.codeHint"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>

            <v-flex xs5></v-flex>
            <v-flex xs5>
              <v-btn class="success" @click="createClient">{{ $t("validate") }}</v-btn>
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
      client: {}
    };
  },
  methods: {
    createClient() {
      this.$http
        .createClient(this.client)
        .then(response => {
          if (response.data && response.status === 201) {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("Client created"),
              color: "success"
            });
            this.client = {};
          }
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    }
  },
  computed: {
    isNew() {
      return this.$route.params.id;
    }
  },
  created() {
    if (this.$route.params.id) {
      this.client = require("@/assets/data/client.json");
    }
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

.pt-0 {
  margin-right: 0px !important;
  margin-left: 0px !important;
  padding-right: 0px;
  margin-top: 0px !important;
}

@media only screen and (min-width: 1264px) {
  .container {
    max-width: 100%;
  }
}

div.wrap:nth-child(2) {
  margin-left: 0px;
  margin-right: 0px;
}

div.wrap:nth-child(2) > div:nth-child(1) {
  padding-top: 0px;
  padding-left: 0px;
  margin-right: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: #2195f2 !important;
}
</style>
