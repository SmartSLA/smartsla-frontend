<template>
  <div>
    <span class="contracts-search-span hidden-xs-only">{{ $t("Search by:") }}</span>
    <v-layout row wrap>
      <v-flex xs12 sm4 md4 lg4 xl4 pr-1 mb-1>
        <v-text-field
          v-model="search"
          :placeholder="$i18n.t('Name')"
          single-line
          hide-details
          solo
          class="contracts-search-name"
        ></v-text-field>
      </v-flex>
      <v-flex xs6 sm4 md4 lg4 xl4 pr-1 mb-1>
        <v-select
          solo
          :items="statusList"
          item-text="label"
          item-value="value"
          v-model="status"
          hide-details
          :label="$i18n.t('Status')"
          :no-data-text="$i18n.t('No data available')"
          class="contracts-search-status"
        ></v-select>
      </v-flex>
      <v-flex xs6 sm4 md4 lg4 xl4 mb-1>
        <v-select
          solo
          :items="clients"
          v-model="client"
          hide-details
          :label="$i18n.t('Client')"
          :no-data-text="$i18n.t('No data available')"
          class="contracts-search-client"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout justify-end>
      <v-btn flat :to="{ name: 'NewContract' }" v-if="$auth.check('admin')">
        <v-icon class="mr-2">add_circle</v-icon>
        {{ $t("Add contract") }}
      </v-btn>
    </v-layout>
    <div v-if="status || client" class="contracts-filters">
      <v-chip v-if="status" @input="status = null" close>{{ $i18n.t("status") }} : {{ $i18n.t(status) }}</v-chip>
      <v-chip v-if="client" @input="client = ''" close>{{ $i18n.t("client") }} : {{ $i18n.t(client) }}</v-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: "contract-list-filter",
  props: {
    statusList: Array,
    clients: Array
  },
  data: () => ({
    client: null,
    status: null,
    search: null
  }),
  watch: {
    search(term) {
      this.$emit("search-updated", term);
    },
    status(selectedStatus) {
      this.$emit("status-updated", selectedStatus);
    },
    client(selectedClient) {
      this.$emit("client-updated", selectedClient);
    }
  }
};
</script>
<style lang="stylus" scoped>
.contracts-search-span {
  padding-top: 15px;
  width: 100px;
  color: #777;
}

.contracts-filters,
.contracts-search {
  display: inline-flex !important;
  margin-bottom: 24px;
}

.v-input.contracts-search-name, .v-input.v-text-field {
  margin-right: 10px !important;
}

.contracts-search {
  width: 100% !important;
}
</style>
