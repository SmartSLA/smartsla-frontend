<template>
  <v-toolbar class="main-menu" v-if="$auth.ready()">
    <v-toolbar-items class="hidden-sm-and-down">
      <v-list-tile
        v-for="menuItem in filteredMenuItems"
        :key="menuItem.icon"
        :to="{ name: menuItem.path || menuItem.name }"
        :class="{
          'primary active-menu-link': menuItem.name.includes(currentActiveMenu),
          regular: !menuItem.name.includes(currentActiveMenu)
        }"
        :dark="menuItem.name.includes(currentActiveMenu)"
      >
        <v-badge color="red" v-if="menuItem.count">
          <span slot="badge">{{ menuItem.count }}</span>
          <v-list-tile-title>
            <v-icon :dark="menuItem.name.includes(currentActiveMenu)">{{ menuItem.icon }}</v-icon>
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
          v-for="menuItem in filteredMenuItems"
          :key="menuItem.icon"
          :to="{ name: menuItem.path || menuItem.name }"
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
      ticketsSize: "ticket/getNbOfTickets"
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
            }

            return item;
          })
      );
    }
  },
  created() {
    this.$store.dispatch("ticket/countTickets");
  },
  mounted() {
    this.menuItems = [
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
        name: routeNames.DASHBOARD,
        text: this.$i18n.t("Dashboard"),
        icon: "dashboard",
        show: false
      },
      {
        name: routeNames.SATISFACTION,
        text: this.$i18n.t("Satisfaction"),
        icon: "favorite",
        show: false
      },
      {
        name: routeNames.CONTRIBUTIONS,
        text: this.$i18n.t("Contributions"),
        icon: "format_line_spacing",
        show: true
      },
      {
        name: routeNames.ADMINISTRATION,
        path: routeNames.ADMINHOME,
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

.v-list__tile--active {
  background-color: #2195f2 !important;
  border-color: #2195f2 !important;
}
</style>
