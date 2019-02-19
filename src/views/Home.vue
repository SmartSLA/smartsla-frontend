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
  }
};
</script>
