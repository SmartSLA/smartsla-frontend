<template>
  <v-layout align-start justify-center column>
    <v-flex class="client-contract-links text-truncate">
      <router-link
        v-if="contract && $auth.check('admin')"
        :to="{
          name: 'Client',
          params: { id: contract.clientId }
        }"
        target="_blank"
      >
        <text-highlight :queries="query">{{ contract && contract.client }}</text-highlight>
      </router-link>
      <text-highlight v-else :queries="query">{{ contract && contract.client }}</text-highlight>
    </v-flex>
    <v-flex class="client-contract-links text-truncate">
      <router-link
        v-if="contract && $auth.check('admin')"
        :to="{
          name: 'Contract',
          params: { id: contract._id }
        }"
        target="_blank"
      >
        <text-highlight :queries="query">{{ contract && contract.name }}</text-highlight>
      </router-link>
      <text-highlight v-else :queries="query">{{ contract && contract.name }}</text-highlight>
      <expired-label :expirationDate="contract.endDate"></expired-label>
    </v-flex>
  </v-layout>
</template>

<script>
import ExpiredLabel from "@/components/ExpiredLabel.vue";
export default {
  name: "client-contract-links",
  props: {
    contractId: String,
    query: {
      type: String,
      default: ""
    }
  },
  computed: {
    contract() {
      return this.$store.getters["contract/getContractById"](this.contractId);
    }
  },
  components: {
    ExpiredLabel
  }
};
</script>
<style lang="stylus" scoped>
.client-contract-links {
  padding: 0 !important;
}

.text-truncate {
  line-height: inherit !important;
}
</style>
