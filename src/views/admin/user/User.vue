<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link :to="{ name: 'Users' }">
      <button><v-icon>arrow_back</v-icon></button>
    </router-link>
    <v-layout row wrap justify-space-between>
      <v-flex 12>
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
                <v-btn color="primary" fab small dark :to="{ name: 'UserEdit', params: { id: user._id } }">
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
                  <strong>{{ $t("Role") }} :</strong>
                  {{ user.role }}
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs4>
              <!-- <v-layout row wrap>
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
                          <router-link :to="{ name: 'Contract', params: { id: 15 } }" class="blue-color">{{
                            contract.name
                          }}</router-link>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout> -->
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
      user: {}
    };
  },
  methods: {
    getUser() {
      this.$http
        .getUserById(this.$route.params.id)
        .then(response => {
          this.user = response.data;
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("failed to fetch the user"),
            color: "error"
          });
        });
    }
  },
  created() {
    this.getUser();
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

.fluid {
  padding-right: 30px !important;
  padding-top: 24px;
  padding-left: 0px;
}

.mb-4, mt-4 {
  margin-bottom: 0px !important;
}

.container.grid-list-md .layout .flex {
  padding: 0px;
}

.mx-4 {
  margin-left: 0px !important;
  margin-right: 0px !important;
}

.container.grid-list-md .layout:not(:only-child) {
  margin: auto 0px;
}

.pt-0 {
  margin-left: 0px;
}

.container.grid-list-md .layout .flex {
  padding: 0px;
}

div.wrap:nth-child(2) > div:nth-child(1) {
  padding-right: 40px;
}

.text-lg-left {
  padding-bottom: 0px;
}

div.wrap:nth-child(2) {
  padding-top: 24px;
}

.px-1 {
  margin-top: 0px !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.mt-4 {
  margin-top: 0px !important;
}

@media only screen and (min-width: 1264px) {
  .container {
    max-width: 100% !important;
    padding-right: 24px;
  }
}
</style>
