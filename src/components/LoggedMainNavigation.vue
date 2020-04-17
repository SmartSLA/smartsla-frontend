<template>
  <v-navigation-drawer
    :clipped="drawer.clipped"
    :fixed="drawer.fixed"
    :permanent="drawer.permanent"
    :mini-variant="drawer.mini"
    :value="drawer.open"
    @input="showDrawer($event)"
    width="220"
    mini-variant-width="60"
    mobile-break-point="768"
    app
    v-if="$auth.check()"
  >
    <v-list v-if="!drawer.permanent">
      <v-list-tile @click="setDrawerPermanent">
        <v-list-tile-action><v-icon>menu_open</v-icon></v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ $t("Static menu") }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider class="d-block" v-if="!drawer.permanent"></v-divider>
    <v-list>
      <v-menu
        v-for="menuItem in filteredMenuItems"
        :key="menuItem.icon"
        offset-x
        open-on-hover
        :disabled="!drawer.mini && !menuItem.subMenuItems"
        style="width:100%"
        content-class="elevation-1"
        close-on-click
        close-on-content-click
      >
        <v-list class="pt-0" slot="activator" style="width:100%">
          <v-list-tile
            :class="{ 'active-menu-link': menuItem.name == currentActiveMenu }"
            :to="{ name: menuItem.path || menuItem.name }"
            :disabled="menuItem.subMenuItems && $vuetify.breakpoint.width <= '768'"
          >
            <v-list-tile-action>
              <v-icon>{{ menuItem.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title :class="{ 'with-badge': menuItem.count }">{{ menuItem.text }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-avatar v-if="menuItem.count" v-show="!drawer.mini">
              <v-chip small>{{ menuItem.count }}</v-chip>
            </v-list-tile-avatar>
          </v-list-tile>
        </v-list>
        <v-list dense>
          <v-list-tile :to="{ name: menuItem.path || menuItem.name }">
            <v-list-tile-title :class="{ 'with-badge': menuItem.count }" class="font-weight-bold">
              {{ menuItem.text }}
            </v-list-tile-title>
            <v-list-tile-avatar v-if="menuItem.count" style="justify-content: flex-end;">
              <v-chip small>{{ menuItem.count }}</v-chip>
            </v-list-tile-avatar>
          </v-list-tile>
          <v-divider v-if="menuItem.subMenuItems"></v-divider>
          <v-list-tile
            v-for="subMenuItem in menuItem.subMenuItems"
            :key="subMenuItem.icon"
            :to="{ name: subMenuItem.path || subMenuItem.name }"
          >
            <v-list-tile-title>{{ subMenuItem.text }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-list>
    <v-divider class="d-block"></v-divider>
    <v-list>
      <v-list-tile @click="toggleMiniDrawer">
        <v-list-tile-action name="Toggle menu">
          <v-icon>{{ drawer.mini ? "chevron_right" : "chevron_left" }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content v-if="!drawer.mini">
          <v-list-tile-title>{{ $t("Collapse menu") }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import { routeNames } from "@/router";
export default {
  name: "logged-main-navigation",
  data() {
    return {
      menuItems: []
    };
  },
  computed: {
    ...mapGetters({
      ticketsSize: "ticket/getNbOfTickets",
      contributionsSize: "contribution/getContributionsCount"
    }),

    currentActiveMenu() {
      return (this.$route.matched.length && this.$route.matched[0].name) || this.$route.name;
    },

    filteredMenuItems() {
      return (
        this.menuItems
          .filter(item => item.show)
          // this is the only way to make the menu reactive when building it from array like this is done below...
          .map(item => {
            if (item.name.includes(routeNames.REQUESTS)) {
              item.count = this.ticketsSize;
            } else if (item.name.includes(routeNames.CONTRIBUTIONS)) {
              item.count = this.contributionsSize;
            }

            return item;
          })
      );
    },
    drawer() {
      return this.$store.state.ui.drawer;
    }
  },
  methods: {
    setDrawerPermanent() {
      this.$store.dispatch("ui/setDrawerPermanent");
    },
    toggleMiniDrawer() {
      this.$store.dispatch("ui/toggleMiniDrawer");
    },
    showDrawer(value) {
      this.$store.dispatch("ui/showDrawer", value);
    }
  },
  created() {
    this.$store.dispatch("ticket/countTickets");
    this.$store.dispatch("contribution/countContributions");
  },
  mounted() {
    this.menuItems = [
      {
        name: routeNames.DASHBOARD,
        text: this.$i18n.t("Dashboard"),
        icon: "dashboard",
        show: false
      },
      {
        name: routeNames.CREATEREQUEST,
        text: this.$i18n.t("New issue"),
        icon: "create",
        show: true
      },
      {
        name: [routeNames.REQUESTS, routeNames.REQUEST, routeNames.EDITREQUEST],
        path: routeNames.REQUESTS,
        text: this.$i18n.t("Requests"),
        icon: "format_list_numbered",
        show: true
      },
      {
        name: routeNames.CONTRIBUTIONS,
        text: this.$i18n.t("Contributions"),
        icon: "format_line_spacing",
        show: true
      },
      {
        name: routeNames.ADMINHOME,
        text: this.$i18n.t("Administration"),
        icon: "mdi-tune",
        show: this.$auth.check("admin"),
        subMenuItems: [
          { text: this.$i18n.t("Users"), path: routeNames.USERS },
          { text: this.$i18n.t("Teams"), path: routeNames.TEAMS },
          { text: this.$i18n.t("Roles"), path: routeNames.ADMIN_ROLES },
          { text: this.$i18n.t("Clients"), path: routeNames.CLIENTS },
          { text: this.$i18n.t("Contracts"), path: routeNames.CONTRACTS },
          { text: this.$i18n.t("Softwares"), path: routeNames.SOFTWARELIST }
        ]
      }
    ];
  }
};
</script>

<style lang="stylus">
ticketing-color = #2196f3

.v-navigation-drawer--mini-variant .v-list__tile {
  padding: 0px 6px;
}

.v-list__tile__action {
    min-width: 32px;
}

.v-chip--small {
  font-size: 10px !important;
  height: 16px !important;
}

.v-badge__badge {
  font-size: 10px !important;
}

.v-list__tile__action, .v-list__tile__avatar {
  min-width: 32px !important;
  padding-left: 5px;
}

.v-navigation-drawer--mini-variant .v-divider.d-block {
   display: block !important;
}

.v-navigation-drawer:not(.v-navigation-drawer--mini-variant) > .v-list:not(.v-list--dense) .v-list__tile {
  font-size: 13px !important;
  padding: 0 8px;
  margin: 0;
}

.v-navigation-drawer.v-navigation-drawer--mini-variant > .v-list:not(.v-list--dense) .v-list__tile {
  font-size: 13px !important;
  padding: 0 14px;
  margin: 0;
}

.v-list--dense .v-list__tile {
  font-size: 13px !important;
}

.v-navigation-drawer .v-icon {
  font-size: 20px;
}

.v-navigation-drawer .v-chip .v-chip__content {
  padding: 0 8px;
}

.v-chip--small {
  height: 20px !important;
  margin-left: 4px !important;
}

.v-navigation-drawer .v-list__tile--active {
  background: rgba(0,0,0,0.04);
  box-shadow: inset 3px 0 0 ticketing-color;
}

.v-navigation-drawer .theme--light.v-list .v-list--disabled {
  color: inherit;
}

.v-navigation-drawer .v-menu__activator--active .theme--light.v-list:hover .v-list--disabled {
  background: rgba(0,0,0,0.04);
}

.v-navigation-drawer > .v-list .v-list__tile--active .v-list__tile__title {
  font-weight: 600;
}

.v-list__tile--active .v-chip__content {
  color: ticketing-color;
  font-weight: 600;
}
</style>
