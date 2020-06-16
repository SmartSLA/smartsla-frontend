<template>
  <v-container grid-list-md class="pl-0 pt-0 pr-0">
    <dashboard-grid></dashboard-grid>
  </v-container>
</template>

<script>
import dashboardGrid from "@/components/dashboard/DashboardGrid.vue";

export default {
  name: "Dashboard",
  components: {
    dashboardGrid
  }
};
</script>

<style lang="stylus" scoped></style>
