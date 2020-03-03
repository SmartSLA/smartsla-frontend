<template>
  <span>
    {{ $t(contributionStatus) }}
  </span>
</template>
<script>
import { getContributionStatus } from "@/services/helpers/contribution";

export default {
  name: "contributionStatus",
  props: {
    status: null
  },
  computed: {
    contributionStatus() {
      return getContributionStatus(status);
    }
  }
};
</script>
