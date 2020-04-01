<template lang="">
  <v-card class="px-1 pt-4 mt-4 pb-4 pl-4" v-if="contribution">
    <v-layout row wrap>
      <v-flex xs11>
        <v-layout justify-center row fill-height wrap ml-3>
          <fieldDisplay :label="$t('Contributor')" :value="contribution.author.name"></fieldDisplay>
          <fieldDisplay :label="$t('Proposition date')" :value="contribution.deposedAt"></fieldDisplay>
          <fieldDisplay :label="$t('Software')" :value="contribution.software.name"></fieldDisplay>
          <fieldDisplay :label="$t('Type')" :value="contribution.type"></fieldDisplay>
          <fieldDisplay :label="$t('Version')" :value="contribution.version"></fieldDisplay>
          <fieldDisplay :label="$t('Patched in version')" :value="contribution.fixedInVersion"></fieldDisplay>
        </v-layout>
      </v-flex>
      <v-flex xs1 v-if="canEdit">
        <contributionEditButton :contributionId="contribution._id"></contributionEditButton>
      </v-flex>
    </v-layout>
    <v-divider class="mt-2"></v-divider>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0 ml-3">{{ contribution.name }}</h3>
      </div>
    </v-card-title>
    <v-card-text>
      <v-subheader inset class="ml-0">
        <v-icon>subject</v-icon>
        {{ $t("Description") }}
      </v-subheader>
      <div class="subject-text ml-4" v-html="contribution.description"></div>
    </v-card-text>
    <v-card-text v-for="(link, index) in contribution.links" :key="index">
      <v-subheader inset class="ml-0">
        <v-icon>insert_link</v-icon>
        <span class="font-weight-bold pr-4">{{ $t(link.name) }} </span>
        <a :href="link.url" target="_blank">{{ link.url }}</a>
      </v-subheader>
    </v-card-text>
  </v-card>
</template>
<script>
import fieldDisplay from "@/components/cardText/FieldDisplay";
import contributionEditButton from "@/components/contribution/ContributionEditButton";
import { EXPERT_ROLE } from "@/constants";

export default {
  name: "contributionDetail",
  props: {
    contribution: null
  },
  components: {
    contributionEditButton,
    fieldDisplay
  },
  computed: {
    canEdit() {
      return this.$auth.check(EXPERT_ROLE.ADMIN);
    }
  }
};
</script>
