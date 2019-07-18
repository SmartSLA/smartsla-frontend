<template>
  <v-autocomplete
    :items="searchResults"
    :label="$i18n.t('Search for a client, contract or a ticket')"
    class="pt-2 global-search-box"
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
      searchResults: [],
      clients: [],
      contracts: [],
      tickets: []
    };
  },
  mounted() {
    this.$http.getContracts().then(response => {
      this.contracts = response.data;
    });
    this.$http.listClients().then(response => {
      this.clients = response.data;
    });
    this.$http.listTickets().then(response => {
      this.tickets = response.data;
    });
  },
  methods: {
    filterByGroup(item, queryText, itemText) {
      return item.header || item.divider || itemText.toLowerCase().includes(queryText.toLowerCase());
    },

    selectedItem(item) {
      this.search = null;
      switch (item.type) {
        case "contract":
          this.$router.push({ name: "Contract", params: { id: item.id } });
          break;
        case "client":
          this.$router.push({ name: "Client", params: { id: item.id } });
          break;
        case "ticket":
          this.$router.push({ name: "Request", params: { id: item.id } });
          break;
      }
    },

    buildSearchItems() {
      var searchItems = [{ header: "clients" }];

      this.clients.map(client => {
        searchItems.push({
          name: client.name,
          type: "client",
          id: client._id
        });
      });
      searchItems.push({ divider: true });
      searchItems.push({ header: "contracts" });
      this.contracts.map(contract => {
        searchItems.push({
          name: contract.name,
          type: "contract",
          id: contract._id
        });
      });
      searchItems.push({ divider: true });
      searchItems.push({ header: "tickets" });
      this.tickets.map(ticket => {
        searchItems.push({
          name: ticket.title,
          type: "ticket",
          id: ticket._id
        });
      });

      return searchItems;
    }
  },
  watch: {
    search(val) {
      if (val && val.length > 1) {
        this.searchResults = [...this.buildSearchItems()];
      } else {
        this.searchResults = [];
      }
    }
  }
};
</script>
<style lang="stylus">
.global-search-box .v-icon {
  transform: rotate(0deg) !important;
}
</style>
