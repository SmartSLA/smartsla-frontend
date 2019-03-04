<template>
  <v-container class="pt-0 px-0">
    <v-layout row wrap>
      <v-flex xs12>
        <v-list three-line subheader>
          <v-subheader inset class="text-uppercase blue text-md-center white--text ml-0">{{
            $t("LINAGORA's interlocutor in charge of the request")
          }}</v-subheader>
          <v-card class="pt-2">
            <v-icon large color="blue" class="arrow-down pr-5 pt-2">play_arrow</v-icon>
            <br />
            <v-img class="ml-5 mr-5" :src="avatarUrl" height="150px"></v-img>
            <v-card-title primary-title>
              <div>
                <div class="title text-xs-center ml-4 grey--text text-capitalize">{{ displayName }}</div>
              </div>
            </v-card-title>
          </v-card>
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
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="white lighten-1" @click="videoConference">play_circle_filled</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile class="sidebar-list-item white--text">
            <v-list-tile-avatar>
              <v-icon large class="pl-4 pb-3" color="white">forum</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content dark>
              <v-list-tile-title class="text-capitalize title">{{ $t("chat") }}</v-list-tile-title>
              <v-list-tile-sub-title class="white--text request-sidebar-description pl-1">{{
                $t("To have quick answers to your questions")
              }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple @click="chat">
                <v-icon color="white lighten-1">play_circle_filled</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile class="sidebar-list-item white--text">
            <v-list-tile-avatar>
              <v-icon large class="pl-4 pb-3" color="white" @click="phoneCall">phone_in_talk</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="text-capitalize title">{{ $t("Phone") }}</v-list-tile-title>
              <v-list-tile-sub-title class="white--text request-sidebar-description pl-1">
                {{ $t("Contact us directly") }}
                <br />08.00.05.46.89
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="white lighten-1">play_circle_filled</v-icon>
              </v-btn>
            </v-list-tile-action>
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
import { mapGetters } from "vuex";
import sideBarLinks from "@/components/SideBarLinks.vue";
export default {
  name: "issue-detail-side-bar",
  components: {
    "side-bar-links": sideBarLinks
  },
  methods: {
    link() {
      return;
    },
    videoConference() {
      return;
    },
    chat() {
      return;
    },
    phoneCall() {
      return;
    }
  },
  computed: {
    ...mapGetters({
      avatarUrl: "user/getAvatarUrl",
      displayName: "user/getDisplayName"
    })
  }
};
</script>
<style lang="css">
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
  left: 35%;
}
</style>
