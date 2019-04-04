<template>
  <v-container class="pt-0 px-0">
    <v-layout row wrap>
      <v-flex xs12>
        <v-list three-line subheader>
          <v-subheader inset class="text-uppercase blue text-md-center white--text ml-0">{{
            $t("interlocutor in charge of the request")
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
