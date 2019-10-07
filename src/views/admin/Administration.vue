<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  }
};
</script>

<style lang="stylus"></style>
