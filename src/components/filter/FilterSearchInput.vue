<template>
  <v-flex xs12 sm6 md8>
    <v-toolbar flat dense>
      <v-layout align-center justify-end>
        <v-text-field
          v-model="search"
          prepend-inner-icon="search"
          :placeholder="$t('Search')"
          clearable
          solo
          class="mt-2"
          flat
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
  methods: {
    searchInputChanged() {
      this.$emit("filterSearchInputChanged", this.search);
    }
  }
};
</script>
