<template>
  <div class="home">
    <Home :msg="$t('Welcome to 08000')" />
  </div>
</template>

<script>
import Home from "@/components/Home.vue";

export default {
  name: "home",
  components: {
    Home
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

<style lang="stylus" scoped>
</style>
