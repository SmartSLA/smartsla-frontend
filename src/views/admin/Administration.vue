<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <breadcrumbs></breadcrumbs>
    <router-view></router-view>
  </div>
</template>
<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue";

export default {
  components: {
    Breadcrumbs
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  }
};
</script>

<style lang="stylus"></style>
