<template>
  <v-toolbar class="main-menu" v-if="$auth.ready()">
    <v-toolbar-items class="hidden-sm-and-down">
      <v-list-tile
        v-for="menuItem in menuItems"
        :key="menuItem.icon"
        :to="{ name: menuItem.name }"
        :class="{
          'primary active-menu-link': menuItem.name == currentActiveMenu,
          regular: menuItem.name != currentActiveMenu
        }"
        :dark="menuItem.name == currentActiveMenu"
        v-if="menuItem.show"
      >
        <v-badge color="red" v-if="menuItem.count">
          <span slot="badge">{{ menuItem.count }}</span>
          <v-list-tile-title>
            <v-icon :dark="menuItem.name == currentActiveMenu">{{ menuItem.icon }}</v-icon>
            {{ menuItem.text }}
          </v-list-tile-title>
        </v-badge>
        <v-list-tile-title v-else>
          <v-icon>{{ menuItem.icon }}</v-icon>
          {{ menuItem.text }}
        </v-list-tile-title>
      </v-list-tile>
    </v-toolbar-items>
    <v-menu class="hidden-md-and-up">
      <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
      <v-list class="logged-main-navigation">
        <v-list-tile
          v-for="menuItem in menuItems"
          :key="menuItem.icon"
          :to="{ name: menuItem.name }"
          :class="{
            'primary active-menu-link': menuItem.name == currentActiveMenu,
            regular: menuItem.name != currentActiveMenu
          }"
          :dark="menuItem.name == currentActiveMenu"
        >
          <v-badge color="red" v-if="menuItem.count">
            <span slot="badge">{{ menuItem.count }}</span>
            <v-list-tile-title>
              <v-icon :dark="menuItem.name == currentActiveMenu">{{ menuItem.icon }}</v-icon>
              {{ menuItem.text }}
            </v-list-tile-title>
          </v-badge>
          <v-list-tile-title v-else>
            <v-icon>{{ menuItem.icon }}</v-icon>
            {{ menuItem.text }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { routeNames } from "@/router";
export default {
  name: "logged-main-navigation",
  data() {
    return {
      menuItems: []
    };
  },
  computed: {
    routeNames() {
      return routeNames;
    },

    currentActiveMenu() {
      return this.$route.name;
    },

    requestsCount() {
      var requests = require("@/assets/data/requests.json");
      return requests.length;
    }
  },
  created() {
    this.menuItems = [
      {
        name: routeNames.CREATEREQUEST,
        text: this.$i18n.t("Create Request"),
        icon: "create",
        show: true
      },
      {
        name: routeNames.REQUESTS,
        text: this.$i18n.t("Requests"),
        icon: "format_list_numbered",
        show: true,
        count: this.requestsCount
      },
      {
        name: routeNames.DASHBOARD,
        text: this.$i18n.t("Dashboard"),
        icon: "dashboard",
        show: true
      },
      {
        name: routeNames.SATISFACTION,
        text: this.$i18n.t("Satisfaction"),
        icon: "favorite",
        show: true
      },
      /*{
        name: routeNames.HISTORIC,
        text: this.$i18n.t("Historic"),
        icon: "restore",
        show: true
      },*/
      {
        name: routeNames.CONTRIBUTIONS,
        text: this.$i18n.t("Contributions"),
        icon: "format_line_spacing",
        show: true
      },
      {
        name: routeNames.ORDERS,
        text: this.$i18n.t("Orders"),
        icon: "grid_on",
        show: true
      },
      {
        name: routeNames.ADMINISTRATION,
        text: this.$i18n.t("Administration"),
        icon: "mdi-tune",
        show: this.$auth.check("admin")
      }
    ];
  }
};
</script>

<style lang="stylus" scoped>
.theme--light.v-icon {
  color: #000000 !important;
}

.regular {
  float: left;
  color: #000000;
  background-color: #EEEEEE;
}

.regular:hover {
  background-color: #DDDDDD !important;
}

.active {
  background-color: #307dbf !important;
  color: #FFFFFF !important;
}

.v-list.logged-main-navigation.theme--light {
  padding: 0px;
  display: grid;
  margin: 0px;
}

.main-menu.v-toolbar.theme--light {
  box-shadow: none;
  width: 60%;
  float: left;
  padding: 0px;
  margin: 0px;
}

.v-list__tile__title {
  padding-top: 5px;
}

.active-menu-link.v-list__tile--active {
  color: red !important;
}
</style>
