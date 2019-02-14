<template>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
    {{snackbar.message}}
    <v-btn dark flat @click="snackbar.show = false">{{$t('Close')}}</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Snackbar",
  computed: {
    ...mapState("ui", ["snackbar"])
  }
};
</script>

<style>
</style>
