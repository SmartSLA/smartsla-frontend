<template>
  <v-toolbar flat dense>
    <v-toolbar-title class="subheading hidden-sm-and-down">{{ $t("Filter by:") }}</v-toolbar-title>
    <v-divider vertical class="hidden-xs-only"></v-divider>
    <v-overflow-btn
      :items="categoriesList"
      :label="$t('Categories')"
      class="py-0"
      hide-details
      flat
      overflow
      item-text="value"
      item-value="key"
      v-model="categoriesFilter"
      @change="categorySelected"
    ></v-overflow-btn>
    <v-divider vertical class="hidden-xs-only"></v-divider>
  </v-toolbar>
</template>
<script>
export default {
  name: "filterCategories",
  props: {
    categories: null
  },
  computed: {
    categoriesList() {
      return this.categories || [];
    }
  },
  data() {
    return {
      categoriesFilter: null
    };
  },
  methods: {
    categorySelected() {
      this.$emit("filterCategoryChanged", this.categoriesFilter);
    }
  }
};
</script>
