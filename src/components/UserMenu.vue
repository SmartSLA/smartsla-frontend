<template>
  <v-list right>
    <v-spacer></v-spacer>
    <v-list-tile @click.prevent="" class="user-menu-item">
      <v-icon>search</v-icon>
    </v-list-tile>
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <op-avatar slot="activator"></op-avatar>
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title class="title">{{ getDisplayName }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ getEmail }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider />
        <v-list-tile @click.prevent="profile">
          <v-list-tile-title>{{ $t("Profile") }}</v-list-tile-title>
        </v-list-tile>
        <v-divider />
        <v-list-tile @click.prevent="settings">
          <v-list-tile-title>{{ $t("Settings") }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click.prevent="logout">
          <v-list-tile-title>{{ $t("Logout") }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-list>
</template>

<script>
import { mapGetters } from "vuex";
import { OPAvatar } from "vue-openpaas-components";
import { routeNames } from "@/router";

export default {
  name: "op-user-menu",
  components: { "op-avatar": OPAvatar },
  methods: {
    logout() {
      return this.$store.dispatch("session/logout").then(() => {
        this.$router.push({ name: routeNames.LOGIN });
      });
    },

    profile() {
      return this.$router.push({ name: routeNames.PROFILE });
    },

    settings() {
      return this.$router.push({ name: routeNames.SETTINGS });
    }
  },
  computed: {
    ...mapGetters({
      getAvatarUrl: "user/getAvatarUrl",
      getDisplayName: "user/getDisplayName",
      getEmail: "user/getEmail"
    })
  }
};
</script>

<style lang="stylus" scoped>
.user-menu-item
  float: left;
.v-list.theme--light
    background-color: #eee;
.theme--light.v-icon
  color: #000000 !important;
.v-menu.v-menu--inline
    padding-left: 25px;
    padding-top: 8px;
</style>
