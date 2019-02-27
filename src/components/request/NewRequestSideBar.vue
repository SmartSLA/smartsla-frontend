<template>
  <v-container class="pt-0 px-0">
    <v-layout row wrap>
      <v-flex xs12>
        <v-list three-line subheader>
          <v-subheader inset class="text-uppercase blue white--text title ml-0">
            <v-icon large color="white">info</v-icon>
            {{$t("urgent request")}}
          </v-subheader>
          <v-icon large color="blue" class="arrow-down pr-4">play_arrow</v-icon>
          <v-list-tile class="sidebar-list-item white--text pl-0">
            <v-list-tile-avatar>
              <v-icon large class="pl-4 pb-3" color="white">mdi-message-video</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="text-capitalize title">{{$t("videoconference")}}</v-list-tile-title>
              <v-list-tile-sub-title class="white--text request-sidebar-description pl-1 caption">
                {{$t("For a direct exchange with your support")}}
                {{$t("ex: discussion, screen sharing ...)")}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile class="sidebar-list-item white--text">
            <v-list-tile-avatar>
              <v-icon large class="pl-4 pb-3" color="white">forum</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content dark>
              <v-list-tile-title class="text-capitalize title">{{$t("chat")}}</v-list-tile-title>
              <v-list-tile-sub-title
                class="white--text request-sidebar-description pl-1"
              >{{$t("To have quick answers to your questions")}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile class="sidebar-list-item white--text">
            <v-list-tile-avatar>
              <v-icon large class="pl-4 pb-3" color="white">phone_in_talk</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="text-capitalize title">{{$t("Phone")}}</v-list-tile-title>
              <v-list-tile-sub-title class="white--text request-sidebar-description pl-1">
                {{$t("Contact us directly")}}
                <br>08.00.05.46.89
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12>
        <v-list class="blue-grey lighten-5 grey--text body-1">
          <v-list-tile @click="link">
            <v-list-tile-action>
              <v-icon color="grey">mdi-comment-question-outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("FAQ")}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="link">
            <v-list-tile-action>
              <v-icon color="grey">mdi-file-document</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("watches")}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="link">
            <v-list-tile-action>
              <v-icon color="grey">mdi-lightbulb-outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="body-1">{{$t("tips and tricks / best practices")}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="link">
            <v-list-tile-action>
              <v-icon color="grey">mdi-forum-outline</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("Forums")}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="link">
            <v-list-tile-action>
              <v-icon color="grey">person</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("User clubs")}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="link">
            <v-list-tile-action>
              <v-icon color="grey">mdi-tie</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("OBA experts")}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: "new-request-side-bar",
  methods: {
    link() {
      return;
    }
  }
};
</script>
<style lang="css">
.sidebar-list-item {
  background-color: #40475e;
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
