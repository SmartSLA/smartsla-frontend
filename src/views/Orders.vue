<template>
  <div>{{ msg }}</div>
</template>
<script>
export default {
  data() {
    return {
      msg: "Welcome to Orders Page!!"
    };
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "main-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  }
};
</script>
<style type="text/css">
.elevation-1 {
  width: 100% !important;
}
</style>
