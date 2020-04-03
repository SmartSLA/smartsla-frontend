<template>
  <v-autocomplete
    :items="searchResults"
    :label="$i18n.t('Search for a client, contract or a ticket')"
    class="pt-2"
    light
    flat
    solo
    clearable
    append-icon
    hide-no-data
    item-text="name"
    color="secondary"
    :background-color="backgroundColor"
    :prepend-icon="preprendIcon"
    :prepend-inner-icon="prependInnerIcon"
    :filter="filterByGroup"
    :search-input.sync="search"
    @input="selectedItem"
    @click:prepend="emitHiddenValue"
    return-object
  >
    <template v-slot:item="data">
      <v-list-tile-content>
        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
      </v-list-tile-content>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "global-search",
  props: ["isMobile", "hidden"],
  data() {
    return {
      search: null,
      searchResults: [],
      contracts: []
    };
  },
  mounted() {
    if (this.$auth.check() && this.userType !== "beneficiary") {
      this.$http.getContracts().then(response => {
        this.contracts = response.data;
      });
      this.$store.dispatch("client/fetchClients");
    }
    this.$store.dispatch("ticket/fetchTickets");
  },
  computed: {
    ...mapGetters({
      userType: "user/getType",
      tickets: "ticket/getTickets",
      clients: "client/getClients"
    }),
    backgroundColor() {
      return this.isMobile ? "" : "#eee";
    },
    preprendIcon() {
      return this.isMobile ? "arrow_back" : undefined;
    },
    prependInnerIcon() {
      return this.isMobile ? undefined : "search";
    }
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
      return this.emitHiddenValue();
    },

    buildSearchItems() {
      var searchItems = [];
      if (this.userType !== "beneficiary") {
        searchItems.push({ header: "clients" });
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
      }
      searchItems.push({ header: "tickets" });
      this.tickets.map(ticket => {
        searchItems.push({
          name: `#${ticket._id} ${ticket.title}`,
          type: "ticket",
          id: ticket._id
        });
      });

      return searchItems;
    },
    emitHiddenValue() {
      this.$emit("updated-hidden", false);
    }
  },
  watch: {
    search(val) {
      if (val && val.length) {
        this.searchResults = [...this.buildSearchItems()];
      } else {
        this.searchResults = [];
      }
    }
  }
};
</script>
