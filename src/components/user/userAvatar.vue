<template>
  <v-avatar :size="size">
    <img v-if="userId" :src="avatarUrl" />
    <v-icon medium v-else>{{ defaultIcon }}</v-icon>
  </v-avatar>
</template>

<script>
import { getUserAvatarUrl } from "@/services/helpers/user";

export default {
  name: "userAvatar",
  computed: {
    avatarUrl() {
      return getUserAvatarUrl(this.userId);
    }
  },
  props: {
    userId: String,
    size: {
      type: [Number, String],
      default: 32
    },
    defaultIcon: {
      type: String,
      default: "account_circle"
    }
  }
};
</script>
