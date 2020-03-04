<template>
  <div>
    <v-list-tile v-for="user in users" :key="user._id" @click="goToUser(user._id)" avatar>
      <v-list-tile-avatar class="mr-3">
        <img :src="getAvatarUrl(user)" />
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ user.displayName }}</v-list-tile-title>
        <v-list-tile-sub-title>
          <a :href="`mailto:${user.preferredEmail}`">{{ user.preferredEmail }}</a>
        </v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </div>
</template>

<script>
import { getUserAvatarUrl } from "@/services/helpers/user";
import { routeNames } from "@/router";

export default {
  props: {
    users: Array
  },
  methods: {
    getAvatarUrl(user) {
      return getUserAvatarUrl(user);
    },
    goToUser(userID) {
      this.$router.push({ name: routeNames.USER, params: { id: userID } });
    }
  }
};
</script>
