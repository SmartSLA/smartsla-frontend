<template>
  <small v-if="isExpired(expirationDate, haveAStatus, status)" class="expired"> Expired </small>
</template>

<script>
import moment from "moment";

export default {
  props: {
    expirationDate: { type: String },
    haveAStatus: { type: Boolean },
    status: { type: Boolean }
  },

  methods: {
    isExpired(expirationDate, haveAStatus, status) {
      let expired = false;
      const diff = moment().diff(expirationDate);

      if (Math.sign(diff) === 1 || (haveAStatus && !status)) {
        expired = true;
      }

      return expired;
    }
  }
};
</script>

<style lang="stylus">
.expired {
  border: 1px solid;
  margin-left: 10px;
  padding: 2px 2px 2px 2px;
  font-weight: 600;
  color: #d32f2f;
}
</style>
