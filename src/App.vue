<template>
  <v-app id="openpaas">
    <div v-if="$auth.ready()">
      <v-navigation-drawer clipped fixed app v-if="$auth.check()">
        <component v-bind:is="componentName"></component>
      </v-navigation-drawer>
      <v-toolbar clipped-left app fixed color="primary">
        <v-toolbar-title style="width: 275px" class="ml-0 pl-3">
          <img class="hidden-sm-and-down" id="header-logo" src="@/assets/logo_ossa.png" />
        </v-toolbar-title>
        <logged-main-navigation v-if="$auth.check()" />
        <v-spacer></v-spacer>
        <op-user-menu v-if="$auth.check()" />
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-layout justify-center align-center>
            <router-view />
          </v-layout>
        </v-container>
      </v-content>
    </div>
    <div v-else>
      <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
    </div>
    <op-snackbar />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import UserMenu from "@/components/UserMenu.vue";
import LoggedMainNavigation from "@/components/LoggedMainNavigation.vue";
import Snackbar from "@/components/Snackbar.vue";
import NewRequestSideBar from "@/components/request/NewRequestSideBar.vue";
import MainSideBar from "@/components/MainSideBar.vue";
import ContributionsSideBar from "@/components/ContributionsSideBar.vue";
import IssueDetailSideBar from "@/components/request/IssueDetailSideBar.vue";

export default {
  components: {
    "op-user-menu": UserMenu,
    "logged-main-navigation": LoggedMainNavigation,
    "op-snackbar": Snackbar,
    "new-request-side-bar": NewRequestSideBar,
    "main-side-bar": MainSideBar,
    "contributions-side-bar": ContributionsSideBar,
    "issue-detail-side-bar": IssueDetailSideBar
  },
  computed: {
    ...mapGetters({
      componentName: "sidebar/getSideBarComponent"
    })
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
  height: 34px;
  width: 138px;
.v-toolbar__content
    background-color: #eee;


</style>
