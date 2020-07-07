<template>
  <span>
    <text-highlight :queries="query"> {{ $t(contributionStatus) }}</text-highlight>
  </span>
</template>
<script>
import { getContributionStatus } from "@/services/helpers/contribution";

export default {
  name: "contributionStatus",
  props: {
    status: null,
    query: {
      type: String,
      default: ""
    }
  },
  computed: {
    contributionStatus() {
      return getContributionStatus(this.status);
    }
  }
};
</script>
