<template>
  <v-container class="px-0" v-if="$auth.ready() && $auth.check('admin')">
    <v-layout row wrap>
      <v-flex xs12>
        <v-list class="mini-side-bar">
          <v-subheader class="white--text pl-4 subheading font-weight-bold">{{ $i18n.t("Users") }}</v-subheader>
          <v-list-tile @click="link" class="mini-side-bar-item" :class="{ primary: activeAdminMenu == 'users' }">
            <v-list-tile-action>
              <v-icon>people</v-icon>
            </v-list-tile-action>
            <v-list-tile-content @click.prevent="users">
              <v-list-tile-title>{{ $i18n.t("Users") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="link" class="mini-side-bar-item" :class="{ primary: activeAdminMenu == 'teams' }">
            <v-list-tile-action>
              <v-icon>people_outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content @click.prevent="teams">
              <v-list-tile-title>{{ $i18n.t("Teams") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider class="ml-2 mr-2"></v-divider>
          <v-subheader class="white--text pl-4 subheading font-weight-bold">{{ $i18n.t("Clients") }}</v-subheader>
          <v-list-tile @click="link" class="mini-side-bar-item" :class="{ primary: activeAdminMenu == 'clients' }">
            <v-list-tile-action>
              <v-icon>account_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-content @click.prevent="clients">
              <v-list-tile-title>{{ $i18n.t("Clients") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="link" class="mini-side-bar-item" :class="{ primary: activeAdminMenu == 'contracts' }">
            <v-list-tile-action>
              <v-icon>assignment</v-icon>
            </v-list-tile-action>
            <v-list-tile-content @click.prevent="contracts">
              <v-list-tile-title>{{ $i18n.t("Contracts") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider class="ml-2 mr-2"></v-divider>
          <v-subheader class="white--text pl-4 subheading font-weight-bold">{{ $i18n.t("Platform") }}</v-subheader>
          <v-list-tile @click="link" class="mini-side-bar-item" :class="{ primary: activeAdminMenu == 'software' }">
            <v-list-tile-action>
              <v-icon>web</v-icon>
            </v-list-tile-action>
            <v-list-tile-content @click.prevent="softwares">
              <v-list-tile-title>{{ $i18n.t("Software") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            @click="link"
            class="mini-side-bar-item"
            :class="{ primary: activeAdminMenu == 'contributions' }"
          >
            <v-list-tile-action>
              <v-icon>library_add</v-icon>
            </v-list-tile-action>
            <v-list-tile-content @click.prevent="admincontributions">
              <v-list-tile-title>{{ $i18n.t("Contributions") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { routeNames } from "@/router";
import { mapGetters } from "vuex";
export default {
  name: "admin-main-side-bar",
  methods: {
    link() {
      return;
    },
    users() {
      return this.$router.push({ name: routeNames.USERS });
    },
    contracts() {
      return this.$router.push({ name: routeNames.CONTRACTS });
    },
    clients() {
      return this.$router.push({ name: routeNames.CLIENTS });
    },
    teams() {
      return this.$router.push({ name: routeNames.TEAMS });
    },
    softwares() {
      return this.$router.push({ name: routeNames.SOFTWARELIST });
    },
    admincontributions() {
      return this.$router.push({ name: routeNames.ADMINCONTRIBUTIONS });
    }
  },
  computed: {
    ...mapGetters({
      activeAdminMenu: "sidebar/getActiveAdminMenu"
    })
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
