<template>
  <v-container class="px-0" v-if="$auth.ready() && $auth.check('admin')">
    <v-layout row wrap>
      <v-flex xs12>
        <v-list class="mini-side-bar">
          <v-subheader class="white--text pl-4 subheading font-weight-bold">{{ $t("Users") }}</v-subheader>
          <v-list-tile :to="{ name: routeNames.USERS }" class="mini-side-bar-item" active-class="primary">
            <v-list-tile-action>
              <v-icon>people</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t("Users") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :to="{ name: routeNames.TEAMS }" class="mini-side-bar-item" active-class="primary">
            <v-list-tile-action>
              <v-icon>people_outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t("Teams") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider class="ml-2 mr-2"></v-divider>
          <v-subheader class="white--text pl-4 subheading font-weight-bold">{{ $t("Clients") }}</v-subheader>
          <v-list-tile :to="{ name: routeNames.CLIENTS }" class="mini-side-bar-item" active-class="primary">
            <v-list-tile-action>
              <v-icon>account_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t("Clients") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :to="{ name: routeNames.CONTRACTS }" class="mini-side-bar-item" active-class="primary">
            <v-list-tile-action>
              <v-icon>assignment</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t("Contracts") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider class="ml-2 mr-2"></v-divider>
          <v-subheader class="white--text pl-4 subheading font-weight-bold">{{ $t("Platform") }}</v-subheader>
          <v-list-tile :to="{ name: routeNames.SOFTWARELIST }" class="mini-side-bar-item" active-class="primary">
            <v-list-tile-action>
              <v-icon>web</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t("Softwares") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :to="{ name: routeNames.ADMINCONTRIBUTIONS }" class="mini-side-bar-item" active-class="primary">
            <v-list-tile-action>
              <v-icon>library_add</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t("Contributions") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { routeNames } from "@/router";
export default {
  name: "admin-main-side-bar",
  computed: {
    routeNames() {
      return routeNames;
    }
  }
};
</script>

<style lang="stylus" scoped>
.mini-side-bar, .mini-side-bar-item, .mini-side-bar-item .v-icon
  background-color: 2b 303c;
  color: #FFFFFF;
.v-list__tile__content
  margin-left: 15px;
</style>
