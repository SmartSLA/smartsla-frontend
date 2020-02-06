<template>
  <v-flex xs6 md4 sm3 lg4 xl4 pt0>
    <span class="font-weight-bold pr-2">{{ $t(label) }} </span>
    {{ value }}
  </v-flex>
</template>
<script>
export default {
  name: "fieldDisplay",
  props: {
    label: null,
    value: null
  }
};
</script>
