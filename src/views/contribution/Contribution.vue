<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-0 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Contributions' }"
      >&lt; {{ $t("contributions") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs12 sm12 md12 lg7 xl7 class="pr-4">
        <contributionDetail :contribution="contribution"></contributionDetail>
      </v-flex>
      <v-flex xs12 sm12 md12 lg5 xl5>
        <editContributionStatus :contribution="contribution"></editContributionStatus>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import contributionDetail from "@/components/contribution/ContributionDetail";
import editContributionStatus from "@/components/contribution/EditContributionStatus";

export default {
  components: {
    contributionDetail,
    editContributionStatus
  },
  computed: {
    contribution() {
      return this.$store.getters["contribution/getContributionById"](this.$route.params.id);
    }
  },
  mounted() {
    this.$store.dispatch("contribution/fetchContributionById", this.$route.params.id);
  }
};
</script>
