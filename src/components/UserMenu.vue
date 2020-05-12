<template>
  <v-menu offset-y class="my-3 mx-2 user-menu-item">
    <op-avatar slot="activator"></op-avatar>
    <v-list>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title class="title">{{ getDisplayName }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ getEmail }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider />
      <v-list-tile v-if="getId" :to="{ name: routeNames.PROFILE, params: { id: getId } }">
        <v-list-tile-title>{{ $t("Profil") }}</v-list-tile-title>
      </v-list-tile>
      <v-divider />
      <v-list-tile v-if="sspEnabled" :to="{ name: routeNames.RESET_PASSWORD }" target="_blank">
        <v-list-tile-title>{{ $t("Change Password") }}</v-list-tile-title>
      </v-list-tile>
      <v-divider />
      <v-list-tile @click.prevent="logout">
        <v-list-tile-title>{{ $t("Logout") }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters } from "vuex";
import { OPAvatar } from "vue-openpaas-components";
import { routeNames } from "@/router";
import ApplicationSettings from "@/services/application-settings";
export default {
  name: "op-user-menu",
  data: () => ({
    features: ApplicationSettings.FEATURES
  }),
  components: {
    "op-avatar": OPAvatar
  },
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
      getEmail: "user/getEmail",
      getId: "user/getId"
    }),
    routeNames() {
      return routeNames;
    },
    sspEnabled() {
      return this.features.SSP_ENABLED;
    }
  }
};
</script>

<style lang="stylus" scoped>
.user-menu-item {
  float: right;
}

.v-list.theme--light {
  background-color: #eee;
}

.theme--light.v-icon {
  color: #000000 !important;
}
</style>
