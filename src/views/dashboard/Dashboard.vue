<template>
  <v-container grid-list-md class="pl-0 pt-0 pr-0">
    <v-card-text>
      <a href="#" disabled class="text-lg-left action-links">
        <v-icon class="mr-2">dashboard</v-icon>
        {{ $t("DASHBOARD") }}
      </a>
      <a href="#" class="action-links right">
        <v-icon class="mr-2">backup</v-icon>
        {{ $t("EXPORT SHEET (CSV)") }}
      </a>
      <a href="#" class="action-links mr-5 right">
        <v-icon class="mr-2">print</v-icon>
        {{ $t("PRINT SHEET") }}
      </a>
    </v-card-text>
    <img class="dashboard-image" src="@/assets/dashboard.png" />
  </v-container>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "main-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  }
};
</script>

<style lang="stylus" scoped>
.dashboard-image {
  width: 100% !important;
}

.action-links {
  text-decoration: none;
  color: grey;
}
</style>
