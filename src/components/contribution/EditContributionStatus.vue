<template>
  <v-card class="pt-1 mt-4 pb-4">
    <v-card-title primary-title class="px-4 text-capitalize">
      <div>
        <h3 class="headline mb-0">{{ $t("contribution status") }}</h3>
      </div>
    </v-card-title>
    <v-divider class="mx-4"></v-divider>
    <v-layout v-if="contribution">
      <v-flex xs12 md11 sm11 xl11 lg11>
        <v-stepper class="noshadow">
          <v-stepper-header>
            <contributionStep
              stepName="Develop"
              :statusStepDate="contribution.status.develop"
              @statusChange="updateStatus"
            ></contributionStep>
            <v-divider></v-divider>
            <contributionStep
              stepName="Reversed"
              :statusStepDate="contribution.status.reversed"
              @statusChange="updateStatus"
            ></contributionStep>
            <v-divider></v-divider>
            <contributionStep
              stepName="Published"
              :statusStepDate="contribution.status.published"
              @statusChange="updateStatus"
            ></contributionStep>
            <v-divider></v-divider>
            <contributionStep
              stepName="Integrated"
              :statusStepDate="contribution.status.integrated"
              @statusChange="updateStatus"
            ></contributionStep>
            <v-divider vertical></v-divider>
            <contributionStep
              stepName="Rejected"
              :statusStepDate="contribution.status.rejected"
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

export default {
  name: "editContributionStatus",
  props: {
    contribution: null
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
