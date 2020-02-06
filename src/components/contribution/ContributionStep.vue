<template>
  <v-flex class="font-weight-bold">
    <v-icon class="progress-arrow" :class="{ 'green--text': complete }">label_important</v-icon>
    <span class="caption font-weight-bold" :class="{ 'green--text': complete }">{{ $t(stepName) }}</span>
    <v-divider></v-divider>
    <small class="grey--text">{{ stepDate }}</small>
  </v-flex>
</template>
<script>
export default {
  name: "contributionStep",
  props: {
    stepName: null,
    stepDate: null,
    complete: false
  }
};
</script>
