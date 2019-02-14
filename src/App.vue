<template>
  <v-app id="openpaas">
    <v-toolbar clipped-left app fixed color="primary">
      <v-toolbar-title>
        <img id="header-logo" src="@/assets/logo.svg" alt="OpenPaas logo" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <logged-main-navigation v-if="$auth.check()" />
      <op-user-menu v-if="$auth.check()" />
    </v-toolbar>
    <template v-if="$auth.ready()">
      <v-content>
        <v-container fluid fill-height pa-0>
          <v-layout justify-center align-center>
            <router-view />
          </v-layout>
        </v-container>
      </v-content>
    </template>
    <template v-else>
      <v-content>
        <v-container fluid fill-height pa-0>
          <v-layout justify-center align-center>
            <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-content>
    </template>
    <op-snackbar />
  </v-app>
</template>

<script>
import UserMenu from "@/components/UserMenu.vue";
import LoggedMainNavigation from "@/components/LoggedMainNavigation.vue";
import Snackbar from "@/components/Snackbar.vue";

export default {
  components: {
    "op-user-menu": UserMenu,
    "logged-main-navigation": LoggedMainNavigation,
    "op-snackbar": Snackbar
  },
  created() {
    this.$auth.ready(() => {
      this.$store.dispatch("user/fetchUser");
    });
  }
};
</script>

<style lang="stylus">
.v-list.logged-main-navigation.theme--light
  background-color: #EEEEEE;
#header-logo
  height: 35px;
  width: 150px;
</style>
