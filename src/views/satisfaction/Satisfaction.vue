<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: this.$i18n.t("Welcome to satisfaction page!!")
    };
  }
};
</script>

<style lang="stylus" scoped></style>
