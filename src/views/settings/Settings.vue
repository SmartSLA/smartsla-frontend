<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: $i18n.t("Welcome to Settings Page!!")
    };
  }
};
</script>

<style lang="stylus" scoped></style>
