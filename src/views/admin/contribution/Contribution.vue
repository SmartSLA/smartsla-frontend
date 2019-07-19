<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-0 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'AdminContributions' }"
      >&lt; {{ $t("Return to contributions list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs8>
        <v-card class="mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <v-layout>
              <v-flex xs6>
                <div>
                  <h3 class="title font-weight-medium mb-0">{{ contribution.title }}</h3>
                </div>
              </v-flex>
              <v-flex xs6>
                <div class="text-xs-right grey--text">
                  <v-btn color="primary" fab small dark :to="{ name: 'EditContribution', params: { id: 15 } }">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <blockquote>
            <code>{{ contribution.body }}</code>
          </blockquote>
          <v-card-text>
            {{ $t("this contribution has been filed on") }}
            {{ contribution.fileDate }}
            {{ $t("by") }}
            <router-link :to="{ name: 'user' }" class="blue-color">{{ contribution.engineer }}</router-link>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs4>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <img src="@/assets/drupal_logo-blue.png" height="100" />
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap>
            <v-flex xs4>
              <strong>{{ $t("Software") }}:</strong>
            </v-flex>
            <v-flex xs8>{{ contribution.software }}</v-flex>
            <v-flex xs4>
              <strong>{{ $t("Engineer") }}:</strong>
            </v-flex>
            <v-flex xs8>
              <router-link :to="{ name: '#' }" class="blue-color">{{ contribution.engineer }}</router-link>
            </v-flex>
            <v-flex xs4>
              <strong>{{ $t("Request Number") }}:</strong>
            </v-flex>
            <v-flex xs8>
              <router-link :to="{ name: 'request', params: { id: contribution.requestNumber } }" class="blue-color">{{
                contribution.requestNumber
              }}</router-link>
            </v-flex>
            <v-flex xs4>
              <strong>{{ $t("Contribution type") }}:</strong>
            </v-flex>
            <v-flex xs8>{{ contribution.type }}</v-flex>
            <v-flex xs4>
              <strong>{{ $t("concerned version") }}:</strong>
            </v-flex>
            <v-flex xs8>{{ contribution.version }}</v-flex>
            <v-flex xs4>
              <strong>{{ $t("patched in version") }}:</strong>
            </v-flex>
            <v-flex xs8>{{ contribution.patchVersion }}</v-flex>
            <v-flex xs4>
              <strong>{{ $t("Status") }}:</strong>
            </v-flex>
            <v-flex xs8>{{ contribution.status }}</v-flex>
            <v-flex xs4>
              <strong>{{ $t("communication link") }}:</strong>
            </v-flex>
            <v-flex xs8>
              <a :href="contribution.cummunicationLink" class="blue-color">{{ contribution.cummunicationLink }}</a>
            </v-flex>
            <v-flex xs4>
              <strong>{{ $t("Filed on") }}:</strong>
            </v-flex>
            <v-flex xs8>{{ contribution.fileDate }}</v-flex>
            <v-flex xs4>
              <strong>{{ $t("Closed on") }}:</strong>
            </v-flex>
            <v-flex xs8>{{ contribution.closeDate }}</v-flex>
            <v-flex xs3></v-flex>
            <v-flex xs9>
              <v-btn class="white-color blue-background-color">{{ $t("Download Patch") }}</v-btn>
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
      contribution: {
        software: "Drupal",
        title: "Amélioration du module Drupal pour les gros sites",
        body: "Réécriture d'une requếte MySQL générée par Drupal ....",
        fileDate: "02/12/2018",
        closeDate: "13/02/2019",
        engineer: "Fabrice MEUNIER",
        requestNumber: 54125,
        type: "fix",
        version: "7.1.3",
        patchVersion: "7.1.4",
        status: "not reversed",
        cummunicationLink: "www.drupal.com/7.1.4"
      }
    };
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "contributions");
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
  margin-top: 0px !important;
  padding: 0px;
}

div.wrap:nth-child(2) {
  margin: 0px;
}

div.xs8:nth-child(1) {
  padding: 0px;
}

div.xs8:nth-child(1) > div:nth-child(1) {
  padding-left: 16px !important;
  margin-right: 24px;
}

div.xs4:nth-child(2) {
  padding: 0px;
}

.px-1 {
  padding-left: 20px !important;
  padding-right: 20px !important;
}
</style>
