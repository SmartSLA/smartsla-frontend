<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-0 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'ContributionList' }"
      >&lt; {{ $t("contributions") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs7>
        <contributionDetail :contribution="contribution"></contributionDetail>
      </v-flex>
      <v-flex xs4>
        <contributionProgress :contribution="contribution"></contributionProgress>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import contributionDetail from "@/components/contribution/ContributionDetail";
import contributionProgress from "@/components/contribution/ContributionProgress";

export default {
  data: () => ({
    contribution: null
  }),
  components: {
    contributionDetail,
    contributionProgress
  },
  created() {
    this.$http
      .getContributionById(this.$route.params.id)
      .then(({ data }) => {
        this.contribution = data;
      })
      .catch(err => {
        console.log(err);
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch contribution"),
          color: "error"
        });
      });
  }
};
</script>
