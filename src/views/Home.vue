<template>
  <div class="home">
    <Home :msg="$i18n.t('Welcome to 08000')" />
  </div>
</template>

<script>
import Home from "@/components/Home";

export default {
  name: "home",
  components: {
    Home
  }
};
</script>

<style lang="stylus" scoped></style>
