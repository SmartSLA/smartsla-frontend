<template>
  <v-container class="pt-0 px-0">
    <v-layout row wrap>
      <v-flex xs12>
        <side-bar-links />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import sideBarLinks from "@/components/SideBarLinks";
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
<style lang="stylus" scoped>
.sidebar-list-item
  background-color: #2b303c;
.sidebar-list-item .v-icon
  color: white;
.v-list--three-line .v-list__tile
  padding-left: 0 !important;
.request-sidebar-description
  border-left: 1px solid white;
.arrow-down
  transform: rotate(90deg);
  position: absolute;
  left: 30%;
</style>
