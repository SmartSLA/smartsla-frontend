<template>
  <v-app id="openpaas">
    <div v-if="$auth.ready()">
      <v-navigation-drawer clipped fixed app v-if="$auth.check()">
        <component v-bind:is="componentName"></component>
      </v-navigation-drawer>
      <v-toolbar clipped-left app fixed color="primary">
        <v-toolbar-title style="width: 275px" class="ml-0 pl-3">
          <router-link :to="{ path: 'requests' }">
            <img class="hidden-sm-and-down" id="header-logo" src="@/assets/logo_ossa.png" />
          </router-link>
        </v-toolbar-title>
        <v-layout row justify-space-between>
          <v-flex grow>
            <logged-main-navigation v-if="$auth.check()" />
          </v-flex>
          <v-flex shrink>
            <op-user-menu v-if="$auth.check()" />
          </v-flex>
        </v-layout>
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
import AdminMainSideBar from "@/components/admin/AdminMainSideBar.vue";

export default {
  components: {
    "op-user-menu": UserMenu,
    "logged-main-navigation": LoggedMainNavigation,
    "op-snackbar": Snackbar,
    "new-request-side-bar": NewRequestSideBar,
    "main-side-bar": MainSideBar,
    "contributions-side-bar": ContributionsSideBar,
    "issue-detail-side-bar": IssueDetailSideBar,
    "admin-main-side-bar": AdminMainSideBar
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
.red-color {
  color: #d32f2f !important;
}

.red-background-color {
  background-color: #d32f2f !important;
}
.white-color {
  color: #ffffff !important;
}

.white-background-color {
  background-color: #ffffff !important;
}

.yellow-color {
  color: #ffa000 !important;
}

.yellow-background-color {
  background-color: #ffa000 !important;
}

.grey-color {
  color: #e0e0e0 !important;
}

.grey-background-color {
  background-color: #e0e0e0 !important;
}

.blue-color {
  color: #2195f2 !important;
}

.blue-background-color {
  background-color: #2195f2 !important;
}

.green-color {
  color: #76c43d !important;
}

.green-background-color {
  background-color: #76c43d !important;
}

.elevation-1 {
  width: 100% !important;
  padding-bottom: 50px;
  background-color: #ffffff;
}

.v-list.logged-main-navigation.theme--light {
  background-color: #EEEEEE;
  margin: -20px;
  padding: 0px;
}

#header-logo {
  height: 34px;
  width: 138px;
  margin-top: 10px;
}

.v-toolbar__title.ml-0.pl-3 {
  width: 230px !important;
}

.v-toolbar__content {
  background-color: #eee;
}

.v-navigation-drawer.v-navigation-drawer--clipped.v-navigation-drawer--fixed.v-navigation-drawer--open.theme--light {
  background-color: #2b303c;
  width: 280px !important;
}

.v-list__tile {
  font-size: 14px !important;
}

.v-navigation-drawer .v-icon, .v-toolbar.v-toolbar--clipped.v-toolbar--fixed.theme--light.primary .v-icon {
  font-size: 21px !important;
}

.v-list__tile__action, .v-list__tile__avatar {
  min-width: 40px !important;
}

.v-list.v-list--subheader.v-list--three-line.theme--light .v-list__tile__content {
  padding-left: 15px !important;
}

.v-icon.pl-4 {
  padding-left: 15px !important;
}

.file-upload .input-wrapper {
  background-color: #eee !important;
  height: 45px !important;
  width: 150px !important;
}

.file-upload .input-wrapper .file-upload-label {
  color: rgba(0, 0, 0, 0.54) !important;
}

.file-upload .input-wrapper .file-upload-label .file-upload-icon {
  float: left !important;
  font-size: 30px !important;
}

.file-upload .input-wrapper:hover {
  background-color: #eee !important;
}

.v-icon.arrow-down.pr-4.material-icons.theme--light.blue--text, .v-icon.arrow-down.pr-5.pt-2.material-icons.theme--light.blue--text {
  font-size: 36px !important;
}

.v-list--three-line .v-list__tile {
  margin-top: 10px !important;
}

.user-menu-item {
  margin-left: 20%;
}

th.column.sortable.text-xs-left {
  padding: 15px !important;
  text-align: center !important;
}

.active-menu-link a {
  color: white !important;
}

.login-bar .v-toolbar__content {
  background-color: #2195f2;
}

button.v-btn.v-btn--disabled.v-btn--flat.v-btn--icon.theme--light {
  background-color: #2195f2;
}

button.v-btn.v-btn--flat.v-btn--icon.theme--light {
  background-color: #2195f2;
  
}

th {
  background-color: #ffffff;
}

tr:nth-child(even) {
  background-color: #ffffff;
}

tr:nth-child(odd) {
  background-color: #F9F9F9;
}

.layout.justify-center.align-center > div {
  width: 100%;
}

#openpaas > div.application--wrap > div > main > div > div > div > main > div > div.container.fluid.fill-height > div > div > div > div.v-card__text > form > div > div:nth-child(8) > div > div.flex.pl-0.xs6 > div > div.v-input__append-outer {
  height: 48px;
  padding-top: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 0px;
}

.ql-container {
  background: #FAFAFA;
}

form #app .flex.pa-3.xs12.md6 {
  margin: 0px !important;
  padding: 0px !important;
  max-width: 100% !important;
  width: 100% !important;
  display: contents !important;
  clear: both !important;
}

form #app .layout.row.wrap {
  display: block !important;
}

form #app {
  border: solid 1Px #ccc;
  min-height: 600px !important;
}

form #app textarea {
  min-height: 300px !important;
  border: solid 1Px #ccc;
  padding: 10px;
  margin: 0px;
}

form #app .v-text-field__slot {
  padding: 0px;
  margin: -5px;
}

form #app .v-icon.v-icon--link.material-icons.theme--light {
  padding: 10px;
}

.v-btn.v-btn--floating.v-btn--router.v-btn--small.theme--dark.primary {
  box-shadow: 0px 0px;
}

.fluid {
  padding-right: 44px !important;
  // padding-left: 44px !important;
}

.v-card__actions {
  padding-bottom: 24px !important;
}

.container {
  max-width: 100% !important;
}

.required-element label::after, .required-label::after {
  content: '*';
  color: red;
}
</style>
