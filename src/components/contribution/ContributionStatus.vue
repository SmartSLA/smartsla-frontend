<template>
  <span>
    {{ $t(contributionStatus) }}
  </span>
</template>
<script>
import { CONTRIBUTION_STATUS } from "@/constants";

export default {
  name: "contributionStatus",
  props: {
    status: null
  },
  computed: {
    contributionStatus() {
      const { integrated, rejected, reversed, published } = this.status;

      if (rejected) {
        return CONTRIBUTION_STATUS.REJECTED;
      }

      if (integrated) {
        return CONTRIBUTION_STATUS.INTEGRATED;
      }

      if (published) {
        return CONTRIBUTION_STATUS.PUBLISHED;
      }

      if (reversed) {
        return CONTRIBUTION_STATUS.REVERSED;
      }

      return CONTRIBUTION_STATUS.DEVELOP;
    }
  }
};
</script>
