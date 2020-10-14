<template>
  <div>
    <v-list-tile
      v-for="user in users"
      :key="user.user"
      avatar
      :to="isAdmin ? { name: 'User', params: { id: user.user } } : undefined"
    >
      <v-list-tile-avatar class="mr-3">
        <img :src="getAvatarUrl(user.user)" />
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ user.name }}</v-list-tile-title>
        <v-list-tile-sub-title>
          <a :href="`mailto:${user.email}`">{{ user.email }}</a>
        </v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </div>
</template>

<script>
import { getUserAvatarUrl } from "@/services/helpers/user";
import { routeNames } from "@/router";
import { USER_TYPE } from "@/constants.js";

export default {
  props: {
    users: Array
  },
  methods: {
    getAvatarUrl(userId) {
      return getUserAvatarUrl(userId);
    },
    goToUser(userID) {
      this.$router.push({ name: routeNames.USER, params: { id: userID } });
    }
  },
  computed: {
    isAdmin() {
      return this.$auth.check(USER_TYPE.ADMIN);
    }
  }
};
</script>
