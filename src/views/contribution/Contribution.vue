<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-0 mt-4 mb-4">
    <div>
      <router-link :to="toPreviousRoute">
        <button><v-icon>arrow_back</v-icon></button>
      </router-link>
    </div>
    <v-layout row wrap justify-space-between>
      <v-flex xs12 sm12 md12 lg7 xl7>
        <contributionDetail :contribution="contribution"></contributionDetail>
      </v-flex>
      <v-flex xs12 sm12 md12 lg5 xl5 mt-4>
        <editContributionStatus :contribution="contribution"></editContributionStatus>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import contributionDetail from "@/components/contribution/ContributionDetail";
import editContributionStatus from "@/components/contribution/EditContributionStatus";
import { routeNames } from "@/router";

export default {
  data: () => ({
    prevRoute: null
  }),
  components: {
    contributionDetail,
    editContributionStatus
  },
  computed: {
    contribution() {
      return this.$store.getters["contribution/getContributionById"](this.$route.params.id);
    },
    toPreviousRoute() {
      return this.prevRoute ? this.prevRoute.fullPath : { name: routeNames.CONTRIBUTIONS };
    }
  },
  mounted() {
    this.$store.dispatch("contribution/fetchContributionById", this.$route.params.id);
  },
  beforeRouteEnter(_, from, next) {
    next(vm => {
      vm.prevRoute = from;
    });
  }
};
</script>
<style lang="stylus" scoped>
.action-links {
  text-decoration: none;
  color: grey;
  cursor: pointer;
}
</style>
