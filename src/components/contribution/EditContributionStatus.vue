<template>
  <v-card class="pt-1 mt-4 pb-4">
    <v-card-title primary-title class="px-4 text-capitalize">
      <div>
        <span class="subtitle-2 font-weight-bold mb-0" v-if="showTitle">{{ contribution.name }}</span>
        <h3 class="headline mb-0" v-else>{{ $t("contribution status") }}</h3>
      </div>
    </v-card-title>
    <v-divider class="mx-1"></v-divider>
    <v-layout v-if="contribution">
      <v-flex xs12 md12 sm12 xl12 lg12>
        <v-stepper class="noshadow">
          <v-stepper-header>
            <contributionStep
              v-for="(stage, index) in contributionStages"
              :key="index"
              :stepName="stage"
              :statusStepDate="contribution.status[stage]"
              @statusChange="updateStatus"
            ></contributionStep>
          </v-stepper-header>
        </v-stepper>
      </v-flex>
    </v-layout>
  </v-card>
</template>
<script>
import contributionStep from "@/components/contribution/ContributionStep";
import { CONTRIBUTION_STATUS } from "@/constants";

export default {
  name: "editContributionStatus",
  props: {
    contribution: null,
    showTitle: false
  },
  components: {
    contributionStep
  },
  methods: {
    updateStatus(stepName, stepValue = "") {
      const contributionStatus = {
        stepName,
        stepValue
      };

      this.$store
        .dispatch("contribution/updateContributionStatus", {
          contributionId: this.contribution._id,
          options: contributionStatus
        })
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            color: "success",
            message: this.$i18n.t("Contribution status updated")
          });
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            color: "error",
            message: this.$i18n.t("Failed to update contribution status")
          });
        });
    }
  },
  computed: {
    contributionStages() {
      return Object.values(CONTRIBUTION_STATUS);
    }
  }
};
</script>
<style lang="stylus" scoped>
.noshadow {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
</style>
