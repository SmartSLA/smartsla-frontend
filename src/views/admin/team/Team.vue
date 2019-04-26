<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Teams' }"
      >&lt; {{ $t("Return to teams list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs8>
        <v-card class="px-1 mt-4 pb-4">
          <v-layout row wrap>
            <v-flex xs10>
              <v-card-title primary-title class="px-2">
                <div>
                  <h3 class="display-1 font-weight-medium mb-0">{{ team.name }}</h3>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs2>
              <div class="text-xs-right grey--text pt-3">
                <v-btn color="primary" fab small dark :to="{ name: 'TeamEdit', params: { id: 15 } }">
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
                  <strong>{{ $t("Name") }} :</strong>
                  {{ team.name }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Contact") }} :</strong>
                  <router-link :to="{ name: 'Contact', params: { id: team.contact.id } }">
                    {{ team.contact.name }}
                  </router-link>
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Motto") }} :</strong>
                  {{ team.motto }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Email") }} :</strong>
                  {{ team.email }}
                </v-flex>
                <v-flex xs12>
                  <v-layout row wrap>
                    <v-flex xs2>
                      <strong>{{ $t("Members") }} :</strong>
                    </v-flex>
                    <v-flex xs10>
                      <ul>
                        <li v-for="(member, key) in team.members" :key="key">
                          <router-link :to="{ name: 'User', params: { id: member.id } }">{{ member.name }}</router-link>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2></v-flex>
            <v-flex xs4>
              <v-layout row wrap>
                <v-flex xs3>Contracts:</v-flex>
                <v-flex xs9>
                  <ul>
                    <li v-for="(contract, key) in team.contracts" :key="key">
                      <router-link :to="{ name: 'Contract', params: { id: contract.id } }">
                        {{ contract.name }}
                      </router-link>
                    </li>
                  </ul>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs4></v-flex>
      <v-flex xs8>
        <v-card class="px-1 mt-4 pb-4">
          <v-card-title primary-title class="px-2">
            <div>
              <h3 class="title mb-0">{{ $t("Alerts settings") }}</h3>
            </div>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap class="pt-4 px-4">
            <v-flex xs12>
              <strong>{{ $t("Alert system active") }}:</strong>
              {{ $t(team.alertSettings.active) }}
            </v-flex>
            <v-flex xs12>
              <strong>{{ $t("Link to alert page") }}:</strong>
              &nbsp;
              <a :href="team.alertSettings.url" target="_blank">{{ team.alertSettings.urlPage }}</a>
            </v-flex>
            <v-flex xs12>
              <strong>{{ $t("Automatic alert system active") }}:</strong>
              {{ $t(team.alertSettings.autoAlertActive) }}
            </v-flex>
            <v-flex xs12>
              <strong>{{ $t("Automatic alert") }}: {{ $t("Start hour") }}:</strong>
              {{ $t(team.alertSettings.autoAlert.start) }}
            </v-flex>
            <v-flex xs12>
              <strong>{{ $t("Automatic alert") }}: {{ $t("End hour") }}:</strong>
              {{ $t(team.alertSettings.autoAlert.end) }}
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
  name: "team-detail",
  data() {
    return {
      team: {}
    };
  },
  created() {
    this.team = require("@/assets/data/team.json");
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "teams");
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
