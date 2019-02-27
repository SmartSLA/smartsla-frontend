<template>
  <v-list class="logged-main-navigation">
    <!--       <v-list-tile @click.prevent="home" class="logged-main-navigation-item">
        <v-list-tile-title>{{$t('Home')}}</v-list-tile-title>
      </v-list-tile> -->
    <v-list-tile @click.prevent="create_request" class="logged-main-navigation-item">
      <v-list-tile-title>
        <v-icon>create</v-icon>
        {{ $t("Create Request") }}
      </v-list-tile-title>
    </v-list-tile>
    <v-list-tile @click.prevent="requests" class="logged-main-navigation-item">
      <v-list-tile-title>
        <v-icon>format_list_numbered</v-icon>
        {{ $t("Requests") }}
      </v-list-tile-title>
    </v-list-tile>
    <v-list-tile @click.prevent="dashboard" class="logged-main-navigation-item">
      <v-list-tile-title>
        <v-icon>dashboard</v-icon>
        {{ $t("Dashboard") }}
      </v-list-tile-title>
    </v-list-tile>
    <v-list-tile @click.prevent="satisfaction" class="logged-main-navigation-item">
      <v-list-tile-title>
        <v-icon>favorite</v-icon>
        {{ $t("Satisfaction") }}
      </v-list-tile-title>
    </v-list-tile>
    <v-list-tile @click.prevent="historic" class="logged-main-navigation-item">
      <v-list-tile-title>
        <v-icon>restore</v-icon>
        {{ $t("Historic") }}
      </v-list-tile-title>
    </v-list-tile>
    <v-list-tile @click.prevent="contributions" class="logged-main-navigation-item">
      <v-list-tile-title>
        <v-icon>format_line_spacing</v-icon>
        {{ $t("Contributions") }}
      </v-list-tile-title>
    </v-list-tile>
    <v-list-tile @click.prevent="orders" class="logged-main-navigation-item">
      <v-list-tile-title>
        <v-icon>grid_on</v-icon>
        {{ $t("Orders") }}
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
    dashboard() {
      return this.$router.push({ name: routeNames.DASHBOARD });
    },
    satisfaction() {
      return this.$router.push({ name: routeNames.SATISFACTION });
    },
    historic() {
      return this.$router.push({ name: routeNames.HISTORIC });
    },
    contributions() {
      return this.$router.push({ name: routeNames.CONTRIBUTIONS });
    },
    orders() {
      return this.$router.push({ name: routeNames.ORDERS });
    }
  }
};
</script>

<style lang="stylus" scoped>
.theme--light.v-icon
  color: #000000 !important;

.logged-main-navigation-item
  float: left;
  color: #000000;
  background-color: #EEEEEE;

.logged-main-navigation-item:hover
    background-color: #DDDDDD !important;

.active
    background-color: #307dbf !important;
    color: #FFFFFF !important;
</style>
