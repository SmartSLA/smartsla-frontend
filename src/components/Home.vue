<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { routeNames } from "@/router";
export default {
  name: "Home",
  props: {
    msg: String
  },
  beforeCreate() {
    this.$router.push({ name: routeNames.REQUESTS });
  }
};
</script>

<style scoped lang="stylus">
</style>
