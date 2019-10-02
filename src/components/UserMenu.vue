<template>
  <v-layout row>
    <v-flex xs8>
      <global-search />
    </v-flex>
    <v-flex xs4>
      <v-layout row justify-end>
        <v-flex xs5>
          <v-menu offset-y class="pt-3 user-menu-item">
            <op-avatar slot="activator"></op-avatar>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title class="title">{{ getDisplayName }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ getEmail }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider />
              <v-list-tile @click.prevent="logout">
                <v-list-tile-title>{{ $t("Logout") }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { OPAvatar } from "vue-openpaas-components";
import { routeNames } from "@/router";
import globalSearch from "@/components/search/GlobalSearch.vue";
export default {
  name: "op-user-menu",
  components: {
    "op-avatar": OPAvatar,
    "global-search": globalSearch
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
      getEmail: "user/getEmail"
    })
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

.v-menu.v-menu--inline {
  padding-left: 25px;
  padding-top: 8px;
}

.pull-right {
  float: right;
  width: 75%;
}
</style>
