<template>
  <v-container class="pt-0 px-0">
    <v-layout row wrap>
      <v-flex xs12>
        <v-list three-line subheader>
          <v-subheader inset class="text-uppercase blue white--text title ml-0">
            <v-icon large color="white">info</v-icon>
            {{ $t("urgent request") }}
          </v-subheader>
          <v-icon large color="blue" class="arrow-down pr-4">play_arrow</v-icon>
          <v-list-tile class="sidebar-list-item white--text pl-0">
            <v-list-tile-avatar>
              <v-icon large class="pl-4 pb-3" color="white">mdi-message-video</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="text-capitalize title">{{ $t("videoconference") }}</v-list-tile-title>
              <v-list-tile-sub-title class="white--text request-sidebar-description pl-1 caption">
                {{ $t("For a direct exchange with your support") }}
                {{ $t("ex: discussion, screen sharing ...)") }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile class="sidebar-list-item white--text">
            <v-list-tile-avatar>
              <v-icon large class="pl-4 pb-3" color="white">phone_in_talk</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="text-capitalize title">{{ $t("Phone") }}</v-list-tile-title>
              <v-list-tile-sub-title class="white--text request-sidebar-description pl-1">
                {{ $t("Contact us directly") }}
                <br />08.00.05.46.89
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12>
        <side-bar-links />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import sideBarLinks from "@/components/SideBarLinks.vue";
export default {
  name: "new-request-side-bar",
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
<style lang="css" scoped>
.sidebar-list-item {
  background-color: #2b303c;
}

.sidebar-list-item .v-icon {
  color: white;
}
.v-list--three-line .v-list__tile {
  padding-left: 0 !important;
}
.request-sidebar-description {
  border-left: 1px solid white;
}
.arrow-down {
  transform: rotate(90deg);
  position: absolute;
  left: 30%;
}
</style>
