<template>
  <div>{{ msg }}</div>
</template>
<script>
export default {
  data() {
    return {
      msg: this.$i18n.t("Welcome to profile!!")
    };
  }
};
</script>
<style lang="stylus"></style>
