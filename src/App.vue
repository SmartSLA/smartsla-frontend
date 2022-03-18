<template>
  <v-app id="openpaas">
    <div v-if="$auth.ready()">
      <logged-main-navigation v-if="$auth.check()" />
      <v-toolbar
        app
        light
        color="white"
        class="toolbar elevation-2"
        :fixed="toolbar.fixed"
        :clipped-left="toolbar.clippedLeft"
        :clipped-right="toolbar.clippedRight"
        v-if="$auth.check() && !hidden"
      >
        <v-toolbar-title class="d-flex align-center">
          <v-toolbar-side-icon
            v-if="$auth.check() && !hidden"
            class="mx-2"
            @click.stop="toggleDrawer()"
            v-show="$vuetify.breakpoint.width <= '768'"
          ></v-toolbar-side-icon>
          <router-link v-if="!hidden" :to="{ name: routeNames.REQUESTS }" class="mx-2">
            <v-img contain width="160" max-height="38" class="hidden-sm-and-down" :src="logo" />
            <v-img contain width="140" max-height="30" class="hidden-md-and-up" :src="logo" />
          </router-link>
        </v-toolbar-title>
        <v-spacer v-if="!hidden"></v-spacer>
        <v-slide-x-reverse-transition>
          <global-search
            class="mx-2"
            v-if="$auth.check()"
            v-show="hidden || !isMobile"
            :isMobile="isMobile"
            :hidden="hidden"
            @updated-hidden="getHiddenValue"
          />
        </v-slide-x-reverse-transition>
        <v-spacer v-if="!hidden"></v-spacer>
        <v-btn v-if="isMobile && $auth.check() && !hidden" icon @click="hidden = !hidden">
          <v-icon>search</v-icon>
        </v-btn>
        <user-menu v-if="$auth.check() && !hidden" />
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height :class="isMobile ? 'px-1' : ''">
          <v-layout row justify-center align-center>
            <router-view :key="$route.fullPath" />
          </v-layout>
        </v-container>
      </v-content>
    </div>
    <v-layout align-center justify-center row fill-height v-else>
      <v-progress-circular indeterminate :size="70" color="primary"></v-progress-circular>
    </v-layout>
    <snackbar />
  </v-app>
</template>

<script>
import { routeNames } from "@/router";
import ApplicationSettings from "@/services/application-settings";
import UserMenu from "@/components/UserMenu";
import LoggedMainNavigation from "@/components/LoggedMainNavigation";
import Snackbar from "@/components/Snackbar";
import GlobalSearch from "@/components/search/GlobalSearch.vue";

export default {
  metaInfo() {
    return {
      title: this.defaultCompany.name
    };
  },
  components: {
    UserMenu,
    LoggedMainNavigation,
    Snackbar,
    GlobalSearch
  },
  data: () => ({
    hidden: false
  }),
  computed: {
    routeNames() {
      return routeNames;
    },
    defaultCompany() {
      return ApplicationSettings.SUPPORT_ACCOUNT;
    },
    logo() {
      return require("@/assets/" + this.defaultCompany.logo);
    },
    toolbar() {
      return this.$store.state.ui.toolbar;
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        case "sm":
        case "md":
        case "lg":
        case "xl":
          return false;
      }
    }
  },
  methods: {
    toggleDrawer() {
      this.$store.dispatch("ui/toggleDrawer", "drawerLeft");
    },
    getHiddenValue(event) {
      this.hidden = event;
    }
  },
  created() {
    this.$auth.ready(() => {
      this.$store.dispatch("currentUser/fetchUser");
    });
  }
};
</script>

<style lang="stylus">
openpaas-login-color = #1656a5

.white-color {
  color: #ffffff !important;
}

.white-background-color {
  background-color: #ffffff !important;
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




.file-upload .input-wrapper {
  background-color: #eee !important;
  height: 45px !important;
  width: 175px !important;
  margin-left: 10px !important;
}

.file-upload .input-wrapper .file-upload-label {
  color: rgba(0, 0, 0, 0.54) !important;
  padding-left: 0px !important;
}

.file-upload .input-wrapper .file-upload-label .file-upload-icon {
  float: left !important;
  font-size: 30px !important;
}

.file-upload .input-wrapper:hover {
  background-color: #eee !important;
}

.v-icon.arrow-down.pr-4.material-icons.theme--light.blue--text,
.v-icon.arrow-down.pr-5.pt-2.material-icons.theme--light.blue--text {
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
}

.requests-list th.column.text-xs-left, .requests-list th.column.text-xs-center, .requests-list th.column.text-xs-right {
  padding: 15px !important;
}

.login-bar {
  background-color: openpaas-login-color;
}

#login button.v-btn.theme--light {
  background-color: openpaas-login-color !important;
  color: #fff;
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
  padding: 0px !important;
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

.v-card__actions {
  padding-bottom: 24px !important;
}

.container {
  max-width: 100% !important;
}

.required-element label::after, .required-label::after {
  margin-left: 0.5em;
  content: '*';
  color: red;
}

.v-input__append-outer {
  height: 48px;
  display: block !important;
  padding: 0px !important;
  margin: 0px !important;
}

@media only screen and (min-width: 1264px) {
  .file-upload .input-wrapper {
    width: 175px !important;
  }
}

.v-toolbar__content {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.v-card.v-sheet.theme--light p {
  margin-bottom: 0px;
}

.v-btn__content {
  width: 100% !important;
}

.cust_uploader .v-list.theme--light {
  padding: 0px !important;
}
</style>
