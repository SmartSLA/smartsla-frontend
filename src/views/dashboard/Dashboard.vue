<template>
  <dashboard-grid></dashboard-grid>
</template>

<script>
import dashboardGrid from "@/components/dashboard/DashboardGrid.vue";

export default {
  metaInfo() {
    return {
      title: this.$i18n.t("Dashboard")
    };
  },
  name: "Dashboard",
  components: {
    dashboardGrid
  }
};
</script>

<style lang="stylus" scoped></style>
