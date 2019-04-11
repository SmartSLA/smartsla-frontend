<template>
  <v-autocomplete
    :items="searchResults"
    :label="$t('Search for a client, contract or a ticket')"
    class="pt-0 global-search-box"
    append-icon="search"
    background-color="white"
    solo
    hide-no-data
    item-text="name"
    item-value="name"
    :filter="filterByGroup"
    :search-input.sync="search"
    @input="selectedItem"
    return-object
  >
    <template v-slot:item="dada">
      <v-list-tile-content>
        <v-list-tile-title v-html="dada.item.name"></v-list-tile-title>
      </v-list-tile-content>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "global-search",
  data() {
    return {
      search: null,
      searchResults: []
    };
  },
  methods: {
    filterByGroup(item, queryText, itemText) {
      return item.header || item.divider || itemText.toLowerCase().includes(queryText.toLowerCase());
    },

    selectedItem(item) {
      this.search = null;
      // go to client or contract page
    }
  },
  watch: {
    search(val) {
      if (val && val.length > 1) {
        this.searchResults = require("@/assets/data/search.json");
      } else {
        this.searchResults = [];
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.global-search-box .v-icon
  transform: rotate(0deg) !important;
</style>
