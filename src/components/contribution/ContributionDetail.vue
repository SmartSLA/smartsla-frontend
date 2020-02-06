<template lang="">
  <v-card class="px-1 pt-4 mt-4 pb-4 pl-4">
    <v-layout justify-center row fill-height wrap ml-3>
      <fieldDisplay label="Contributor" :value="contribution.author.name"></fieldDisplay>
      <fieldDisplay label="Proposition date" :value="contribution.deposedAt"></fieldDisplay>
      <fieldDisplay label="Software" :value="contribution.software.name"></fieldDisplay>
      <fieldDisplay label="Type" :value="contribution.type"></fieldDisplay>
      <fieldDisplay label="Version" :value="contribution.version"></fieldDisplay>
      <fieldDisplay label="Fixed in version" :value="contribution.patchedInversion"></fieldDisplay>
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

export default {
  name: "contributionDetail",
  props: {
    contribution: Object
  },
  components: {
    fieldDisplay
  }
};
</script>
