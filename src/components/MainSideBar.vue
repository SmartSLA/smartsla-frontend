<template>
  <v-container class="px-0">
    <v-layout row wrap>
      <v-flex xs12>
        <!-- <div class="pl-4 pr-4">
          <v-text-field :label="$t('Search')" solo prepend-inner-icon="search"></v-text-field>
        </div> -->
        <v-list class="mini-side-bar">
          <v-list-tile @click="link" class="mini-side-bar-item">
            <v-list-tile-action>
              <v-icon>playlist_add_check</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t("Metrics") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="link" class="mini-side-bar-item">
            <v-list-tile-action>
              <v-icon>mdi-email-open-outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t("Contacts") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="link" class="mini-side-bar-item">
            <v-list-tile-action>
              <v-icon>mdi-tooltip-text</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t("List of contributions") }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-divider class="ml-2 mr-2"></v-divider>
      <v-flex xs12>
        <side-bar-links />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import sideBarLinks from "@/components/SideBarLinks.vue";
export default {
  name: "main-side-bar",
  components: {
    "side-bar-links": sideBarLinks
  },
  methods: {
    link() {
      return;
    }
  }
};
</script>
<style lang="stylus" scoped>
.mini-side-bar, .mini-side-bar-item, .mini-side-bar-item .v-icon {
  background-color : 2b303c;
  color : #FFFFFF;
}
</style>
