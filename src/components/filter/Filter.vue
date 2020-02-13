<template>
  <div>
    <v-layout column mb-2 mt-4 class="filter_layout">
      <v-flex xs12 md4 mb-2>
        <FilterCategories :categories="categories" @filterCategoryChanged="changeFilterCategory"></FilterCategories>
      </v-flex>
      <v-flex xs12 md4 mb-4>
        <v-toolbar flat dense v-if="!showStoredFilters">
          <v-layout align-center justify-end>
            <v-overflow-btn
              v-if="translatedFilter"
              :items="values"
              :label="$t('Values')"
              v-model="valuesFilter"
              class="pa-0"
              overflow
              flat
              item-text="value"
              item-value="key"
              hide-details
              hide-selected
            ></v-overflow-btn>
            <v-overflow-btn
              v-else
              :items="values"
              :label="$t('Values')"
              :no-data-text="$t('No data available')"
              v-model="valuesFilter"
              flat
              hide-details
              hide-selected
              class="pa-0"
              overflow
            ></v-overflow-btn>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-toolbar-side-icon v-on="on" @click="addNewFilter">
                  <v-icon dark>add</v-icon>
                </v-toolbar-side-icon>
              </template>
              <span>
                {{ $t("This button allows you to add an additional filter to the board") }}
              </span>
            </v-tooltip>
          </v-layout>
        </v-toolbar>
        <FilterLoader v-else :savedFilters="savedFilters" @filterLoaded="loadFilter"></FilterLoader>
      </v-flex>
      <v-flex md4 sm3 mb-4 class="hidden-xs-only"></v-flex>
      <FilterSearchInput @filterSearchInputChanged="changeFilterSearch"></FilterSearchInput>
    </v-layout>
    <FilterActions
      :savedFilters="savedFilters"
      :customFilters="customFilters"
      :storedSelectionsFilter="storedSelectionsFilter"
      :canDelete="canDeleteFilter"
      :canUpdate="canUpdateFilter"
      @filterReset="resetFilters"
      @removeFilter="removeFilter"
      @filterUpdated="handleFilterUpdate"
      @filterDeleted="handleFilterDeletion"
    ></FilterActions>
  </div>
</template>
<script>
import FilterActions from "@/components/filter/FilterActions";
import FilterSearchInput from "@/components/filter/FilterSearchInput";
import FilterLoader from "@/components/filter/FilterLoader";
import FilterCategories from "@/components/filter/FilterCategories";

export default {
  name: "dataTableFilter",
  components: {
    FilterActions,
    FilterSearchInput,
    FilterLoader,
    FilterCategories
  },

  data() {
    return {
      showStoredFilters: false,
      valuesFilter: null,
      customFilters: [],
      storedSelectionsFilter: null,
      canDeleteFilter: false,
      canUpdateFilter: false
    };
  },

  props: {
    categoriesFilter: null,
    categories: null,
    translatedFilter: false,
    values: null,
    savedFilters: null
  },

  methods: {
    addNewFilter() {
      if (this.categoriesFilter && this.valuesFilter) {
        var filter = {
          category: this.categoriesFilter,
          value: this.valuesFilter
        };
        this.customFilters.push(filter);
        this.valuesFilter = "";
        this.checkStoredFilterUpdate();
      }
    },

    loadFilter(filter) {
      this.storedSelectionsFilter = Object.assign({}, filter);
      this.customFilters = [...this.storedSelectionsFilter.items];
      this.canDeleteFilter = true;
      this.valuesFilter = "";
      this.$emit("savedFilterLoaded", this.storedSelectionsFilter.name);
    },

    removeFilter(filter) {
      this.customFilters = this.customFilters.filter(customFilter => {
        return JSON.stringify(customFilter) !== JSON.stringify(filter);
      });

      if (this.customFilters.length == 0) {
        this.canDeleteFilter = false;
        this.storedSelectionsFilter = {};
      }
      this.checkStoredFilterUpdate();
    },

    checkStoredFilterUpdate() {
      if (this.storedSelectionsFilter && this.storedSelectionsFilter.items) {
        if (this.storedSelectionsFilter.items.length !== this.customFilters.length) {
          this.canUpdateFilter = true;
        } else {
          this.canUpdateFilter =
            JSON.stringify(this.storedSelectionsFilter.items) !== JSON.stringify(this.customFilters);
        }
      }
    },

    resetFilters() {
      this.customFilters = [];
    },

    changeFilterCategory(selectedCategory) {
      this.showStoredFilters = selectedCategory === "stored_selections";
      this.$emit("filterCategoryChanged", selectedCategory);
    },

    changeFilterSearch(searchTerm) {
      this.$emit("filterSearchInputChanged", searchTerm);
    },

    handleFilterUpdate() {
      this.canUpdateFilter = false;
      this.$emit("savedFiltersUpdate");
    },

    handleFilterDeletion() {
      this.canDeleteFilter = false;
      this.customFilters = [];
      this.$emit("savedFiltersUpdate");
    }
  },
  watch: {
    customFilters: {
      handler(newCustomFilters) {
        this.$emit("customFiltersUpdated", newCustomFilters);
      },
      deep: true
    }
  }
};
</script>
<style lang="stylus" scoped>
  @media only screen and (min-width: 600px) {
  .filter_layout {
    flex-direction: row !important;
  }
}
</style>
