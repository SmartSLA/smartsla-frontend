<template>
  <v-list class="logged-main-navigation">
<!--       <v-list-tile @click.prevent="home" class="logged-main-navigation-item">
        <v-list-tile-title>{{$t('Home')}}</v-list-tile-title>
      </v-list-tile> -->
      <v-list-tile @click.prevent="create_request" class="logged-main-navigation-item">
        <v-list-tile-title>
          <v-icon>create</v-icon>
          {{$t('Create Request')}}
        </v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click.prevent="requests" class="logged-main-navigation-item">
        <v-list-tile-title>
          <v-icon>format_list_numbered</v-icon>
          {{$t('Requests')}}
        </v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click.prevent="dashboard" class="logged-main-navigation-item">
        <v-list-tile-title>
          <v-icon>dashboard</v-icon>
          {{$t('Dashboard')}}
        </v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click.prevent="satisfaction" class="logged-main-navigation-item">
        <v-list-tile-title>
          <v-icon>favorite</v-icon>
          {{$t('Satisfaction')}}
        </v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click.prevent="historic" class="logged-main-navigation-item">
        <v-list-tile-title>
          <v-icon>restore</v-icon>
          {{$t('Historic')}}
        </v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click.prevent="contributions" class="logged-main-navigation-item">
        <v-list-tile-title>
          <v-icon>format_line_spacing</v-icon>
          {{$t('Contributions')}}
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
</template>

<script>
import { routeNames } from "@/router";

export default {
  name: "logged-main-navigation",
  methods: {
    home() {
      return this.$router.push({ name: routeNames.HOME });
    },
    create_request() {
      return this.$router.push({ name: routeNames.CREATEREQUEST });
    },
    requests() {
      return this.$router.push({ name: routeNames.REQUESTS });
    },
    dashboard() {},
    satisfaction() {},
    historic() {},
    contributions() {}
  }
};
</script>

<style lang="stylus" scoped>
.theme--light.v-icon {
  color: #2196f3 !important;
}
.logged-main-navigation-item {
  float: left;
  color: #2196f3;
  background-color: #EEEEEE;
}
</style>
