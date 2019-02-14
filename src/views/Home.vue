<template>
  <div class="home">
    <HelloWorld :msg="$t('Welcome to Your OpenPaaS Vue.js App')"/>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  }
};
</script>
