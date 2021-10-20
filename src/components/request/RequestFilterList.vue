<template>
  <v-select
    solo
    flat
    dense
    background-color="transparent"
    :items="filters"
    class="filter-menu"
    v-model="currentlySelectedFilter"
    item-text="name"
    item-value="_id"
    :menu-props="{ maxHeight: 600 }"
  >
    <template v-slot:item="{ item }">
      <v-layout row wrap>
        <v-flex xs11>
          <span>{{ $t(item.name) }}</span>
        </v-flex>
        <v-flex xs1>
          <v-chip small v-if="item._id === 'all'" align-end>{{ ticketsCount }}</v-chip>
        </v-flex>
      </v-layout>
    </template>
    <template v-slot:selection="{ item }">
      <span>{{ $t(item.name) }}</span>
    </template>
  </v-select>
</template>

<script>
import { INITIAL_FILTER } from "@/constants";
import { mapGetters } from "vuex";
import { routeNames } from "@/router";

export default {
  name: "request-filter-list",
  data: () => ({
    selectedFilter: null
  }),
  computed: {
    ...mapGetters({
      storedFilters: "filter/getFilterList",
      ticketsCount: "ticket/getNbOfTickets",
      filter: "ticket/filter",
      getQueryAdditionalFilters: "filter/queryAdditionalFilters"
    }),

    filters() {
      return this.storedFilters;
    },

    currentlySelectedFilter: {
      get: function() {
        return this.filter || INITIAL_FILTER;
      },

      set: function(value) {
        this.selectedFilter = value;
      }
    }
  },
  created() {
    this.$store.dispatch("filter/fetchFilters");
  },
  watch: {
    selectedFilter(filter) {
      const query = { filter };

      if (this.getQueryAdditionalFilters) {
        query.a = this.getQueryAdditionalFilters;
      }

      this.$store.dispatch("ticket/setFilter", filter);
      this.$store.dispatch("ticket/fetchTickets");
      this.$router.push({ name: routeNames.REQUESTS, query });
    }
  }
};
</script>

<style lang="stylus">
.filter-menu >.v-input__control > .v-input__slot:hover {
  background-color: #eee !important
}
</style>
