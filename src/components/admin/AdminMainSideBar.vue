<template>
  <v-container class="px-0" v-if="$auth.ready() && $auth.check('admin')">
    <v-layout row wrap>
      <v-flex xs12>
        <v-list dark>
          <v-list-group value="true" class="white--text">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title class="white--text font-weight-bold">{{ $t("Users") }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>

            <v-list-tile :to="{ name: routeNames.USERS }" active-class="primary">
              <v-list-tile-content>
                <v-list-tile-title class="pl-2">{{ $t("Users") }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>people</v-icon>
              </v-list-tile-action>
            </v-list-tile>

            <v-list-tile :to="{ name: routeNames.ADMIN_ROLES }" active-class="primary">
              <v-list-tile-content>
                <v-list-tile-title class="pl-2">{{ $t("Roles") }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>verified_user</v-icon>
              </v-list-tile-action>
            </v-list-tile>

            <v-list-tile :to="{ name: routeNames.TEAMS }" active-class="primary">
              <v-list-tile-content>
                <v-list-tile-title class="pl-2">{{ $t("Teams") }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>people_outline</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>

          <v-list-group value="true">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title class="white--text font-weight-bold">{{ $t("Clients") }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>

            <v-list-tile :to="{ name: routeNames.CLIENTS }" active-class="primary">
              <v-list-tile-content>
                <v-list-tile-title class="pl-2">{{ $t("Clients") }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>account_box</v-icon>
              </v-list-tile-action>
            </v-list-tile>

            <v-list-tile :to="{ name: routeNames.CONTRACTS }" active-class="primary">
              <v-list-tile-content>
                <v-list-tile-title class="pl-2">{{ $t("Contracts") }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>assignment</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
          <v-list-group value="true">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title class="white--text font-weight-bold">{{ $t("Platform") }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>

            <v-list-tile :to="{ name: routeNames.SOFTWARELIST }" active-class="primary">
              <v-list-tile-content>
                <v-list-tile-title class="pl-2">{{ $t("Software") }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>web</v-icon>
              </v-list-tile-action>
            </v-list-tile>

            <v-list-tile :to="{ name: routeNames.ADMINCONTRIBUTIONS }" active-class="primary">
              <v-list-tile-content>
                <v-list-tile-title class="pl-2">{{ $t("Contributions") }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>library_add</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
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
