<template lang="">
  <v-card class="px-4 mx-0 pt-1 mt-4 pb-4 pl-4">
    <v-card-title primary-title class="px-4 text-capitalize">
      <div>
        <h3 class="headline mb-0">{{ $t("contribution status") }}</h3>
      </div>
    </v-card-title>
    <v-divider class="mx-4"></v-divider>
    <v-layout class="mb-1 mx-4">
      <contributionStep stepName="Dev" stepDate="12/12/2002" :complete="true"></contributionStep>
      <contributionStep stepName="Reversed" stepDate="13/12/2002" :complete="true"></contributionStep>
      <contributionStep stepName="Integrated" stepDate="12/12/2002" :complete="true"></contributionStep>
      <contributionStep stepName="Published" stepDate="12/12/2002" :complete="true"></contributionStep>
      <contributionStep stepName="Rejected" stepDate="12/12/2002" :complete="true"></contributionStep>
    </v-layout>
  </v-card>
</template>
<script>
import contributionStep from "@/components/contribution/ContributionStep";
export default {
  name: "contributionProgress",
  props: {
    contribution: Object
  },
  components: {
    contributionStep
  }
};
</script>
