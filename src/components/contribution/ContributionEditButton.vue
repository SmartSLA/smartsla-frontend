<template>
  <v-flex xs6 md4 sm3 lg4 xl4 pt0>
    <div class="text-xs-right grey--text justify-end">
      <v-btn color="primary" fab small dark :to="{ name: routeNames.EDITCONTRIBUTION, params: { id: contributionId } }">
        <v-icon>edit</v-icon>
      </v-btn>
    </div>
  </v-flex>
</template>
<script>
import { routeNames } from "@/router";

export default {
  name: "editContribtion",
  props: {
    contributionId: null
  },
  computed: {
    routeNames() {
      return routeNames;
    },

    canEdit() {
      return this.$auth.check("admin") || this.$auth.check("expert");
    }
  }
};
</script>
