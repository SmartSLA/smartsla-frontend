<template>
  <v-select
    solo
    flat
    dense
    background-color="transparent"
    :items="filters"
    class="filter-menu"
    v-model="selectedFilter"
    item-text="name"
    item-value="_id"
  >
    <template v-slot:item="{ item }">
      <v-layout row wrap>
        <v-flex xs11>
          <span>{{ $t(item.name) }}</span>
        </v-flex>
        <v-flex xs1>
          <v-chip small v-if="item._id === ''" align-end>{{ ticketsCount }}</v-chip>
        </v-flex>
      </v-layout>
    </template>
  </v-select>
</template>

<script>
import { INITIAL_FILTER } from "@/constants";
import { mapGetters } from "vuex";

export default {
  name: "request-filter-list",
  data: () => ({
    selectedFilter: INITIAL_FILTER
  }),
  computed: {
    ...mapGetters({
      storedFilters: "filter/getFilterList",
      ticketsCount: "ticket/getNbOfTickets"
    }),

    filters() {
      return [INITIAL_FILTER, ...this.storedFilters];
    }
  },
  created() {
    this.$store.dispatch("filter/fetchFilters");
  },
  watch: {
    selectedFilter(filter) {
      this.$emit("filter:select", filter);
    }
  }
};
</script>

<style lang="stylus">
.filter-menu >.v-input__control > .v-input__slot:hover {
  background-color: #eee !important
}
</style>
