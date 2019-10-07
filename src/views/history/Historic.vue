<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: this.$i18n.t("Welcome to the historic!!")
    };
  }
};
</script>

<style lang="stylus"></style>
