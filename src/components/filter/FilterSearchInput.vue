<template>
  <v-flex>
    <v-toolbar flat dense>
      <v-layout>
        <v-text-field
          v-model="search"
          :prepend-inner-icon="prependInnerIcon"
          @click:prepend-inner="hideTextField"
          :placeholder="$t('Search')"
          clearable
          solo
          class="mt-2"
          flat
          autofocus
          background-color="#eee"
          @input="searchInputChanged"
        ></v-text-field>
      </v-layout>
    </v-toolbar>
  </v-flex>
</template>
<script>
export default {
  name: "filterSearchInput",
  data() {
    return {
      search: null
    };
  },
  props: ["hideSearchFilter"],
  computed: {
    prependInnerIcon() {
      return this.hideSearchFilter ? "arrow_back" : "undefined";
    }
  },
  methods: {
    searchInputChanged() {
      this.$emit("filterSearchInputChanged", this.search);
    },
    hideTextField() {
      this.$emit("updatedHideSearchFilter");
    }
  }
};
</script>
