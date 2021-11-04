<template>
  <v-layout align-start justify-center column fill-height>
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
  </v-layout>
</template>

<script>
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
  }
};
</script>
