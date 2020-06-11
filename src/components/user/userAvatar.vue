<template>
  <v-avatar :size="size">
    <img v-if="getAvatarUrl" :src="getAvatarUrl" />
    <v-icon v-else>account_circle</v-icon>
  </v-avatar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "userAvatar",
  computed: {
    ...mapGetters({
      getAvatarUrl: "currentUser/getAvatarUrl"
    })
  },
  props: {
    size: {
      type: [Number, String],
      default: 32
    }
  }
};
</script>
