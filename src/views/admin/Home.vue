<template>
  <div>{{ msg }}</div>
</template>
<script>
export default {
  data() {
    return {
      msg: "Administration"
    };
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  }
};
</script>
<style type="text/css">
.elevation-1 {
  width: 100% !important;
}
</style>