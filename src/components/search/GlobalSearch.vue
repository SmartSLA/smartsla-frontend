<template>
  <v-autocomplete
    :items="searchResults"
    :label="$i18n.t('Search')"
    class="pt-2"
    light
    flat
    solo
    :append-icon="clearIcon"
    @click:append="search = null"
    hide-no-data
    item-text="name"
    item-value="name"
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
import { debounce } from "lodash";
import { EXPERT_ROLE, BENEFICIARY_ROLE_LIST } from "@/constants.js";

export default {
  name: "global-search",
  props: ["isMobile", "hidden"],
  data() {
    return {
      search: null,
      searchResults: [],
      tickets: []
    };
  },
  mounted() {
    if (this.$auth.check() && this.$auth.check(EXPERT_ROLE.EXPERT)) {
      this.$store.dispatch("contract/fetchContracts");
      this.$store.dispatch("client/fetchClients");
    } else if (
      this.$auth.check() &&
      (this.$auth.check(BENEFICIARY_ROLE_LIST.OPERATIONAL_MANAGER) ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER))
    ) {
      this.$store.dispatch("contract/fetchContracts");
    }
  },
  computed: {
    ...mapGetters({
      userType: "currentUser/getType",
      clients: "client/getClients",
      contracts: "contract/getContracts"
    }),
    backgroundColor() {
      return this.isMobile ? "" : "#eee";
    },
    preprendIcon() {
      return this.isMobile ? "arrow_back" : undefined;
    },
    prependInnerIcon() {
      return this.isMobile ? undefined : "search";
    },
    clearIcon() {
      return this.search ? "clear" : "undefined";
    }
  },
  methods: {
    loadSearchResults() {
      return this.$http
        .searchTickets(this.search)
        .then(({ data }) => (this.tickets = data.list))
        .then(() => (this.searchResults = [...this.buildSearchItems()]));
    },

    filterByGroup(item, queryText, itemText) {
      return item.header || item.divider || itemText.toLowerCase().includes(queryText.toLowerCase());
    },

    selectedItem(item) {
      this.search = null;
      switch (item.type) {
        case "contract":
          this.$router.push({ name: "ClientContract", params: { id: item.id } });
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
      let searchItems = [];
      if (this.$auth.check(EXPERT_ROLE.EXPERT) || this.$auth.check(EXPERT_ROLE.ADMIN)) {
        searchItems.push({ header: "clients" });
        this.clients.map(client => {
          searchItems.push({
            name: client.name,
            type: "client",
            id: client._id
          });
        });
      }

      if (
        this.$auth.check(EXPERT_ROLE.EXPERT) ||
        this.$auth.check(EXPERT_ROLE.ADMIN) ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.OPERATIONAL_MANAGER) ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER)
      ) {
        searchItems.push({ divider: true });
        searchItems.push({ header: "contracts" });
        this.contracts.map(contract => {
          searchItems.push({
            name: contract.name,
            type: "contract",
            id: contract._id
          });
        });
      }

      searchItems.push({ divider: true });
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
    search: debounce(function(val) {
      if (val) {
        this.loadSearchResults();
      } else {
        this.searchResults = [];
      }
    }, 500)
  }
};
</script>
