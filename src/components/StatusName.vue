<template>
  <span :class="{ inactive: !active }"> {{ name }}</span>
</template>

<script>
export default {
  name: "status-name",
  props: {
    name: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  }
};
</script>
<style lang="stylus">
.inactive {
  text-decoration: line-through;
}
</style>
