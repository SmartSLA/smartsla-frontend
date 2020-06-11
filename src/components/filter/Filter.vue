<template>
  <div>
    <v-layout column mb-2 mt-4 class="filter_layout">
      <v-flex xs12 sm11 md9 lg3 mb-2>
        <FilterCategories :categories="categories" @filterCategoryChanged="changeFilterCategory"></FilterCategories>
      </v-flex>
      <v-flex xs12 sm9 md9 lg3 mb-4>
        <v-toolbar flat dense v-if="!showStoredFilters">
          <v-layout align-center justify-end>
            <v-overflow-btn
              v-if="keyValueFilter"
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
      <v-spacer v-if="hideSearchFilter"></v-spacer>
      <v-layout row justify-end>
        <v-btn v-if="!hideSearchFilter" icon @click="hideSearchFilter = true">
          <v-icon>search</v-icon>
        </v-btn>
        <FilterSearchInput
          @filterSearchInputChanged="changeFilterSearch"
          class="mx-2"
          v-else
          :hideSearchFilter="hideSearchFilter"
          @updatedHideSearchFilter="hideSearchInput"
        ></FilterSearchInput>
        <ExportCsvButton v-if="!hideSearchFilter || this.$vuetify.breakpoint.name != 'xs'"></ExportCsvButton>
      </v-layout>
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
      @filterCreated="handleFilterCreation"
    ></FilterActions>
  </div>
</template>
<script>
import FilterActions from "@/components/filter/FilterActions";
import FilterSearchInput from "@/components/filter/FilterSearchInput";
import FilterLoader from "@/components/filter/FilterLoader";
import FilterCategories from "@/components/filter/FilterCategories";
import ExportCsvButton from "@/components/request/ExportCsvButton";

export default {
  name: "dataTableFilter",
  components: {
    FilterActions,
    FilterSearchInput,
    FilterLoader,
    FilterCategories,
    ExportCsvButton
  },

  data() {
    return {
      showStoredFilters: false,
      valuesFilter: null,
      customFilters: [],
      storedSelectionsFilter: null,
      hideSearchFilter: false
    };
  },

  props: {
    categoriesFilter: null,
    categories: null,
    keyValueFilter: false,
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
      }
    },

    loadFilter(filter) {
      this.storedSelectionsFilter = Object.assign({}, filter);
      this.customFilters = [...this.storedSelectionsFilter.items];
      this.valuesFilter = "";
      this.$emit("savedFilterLoaded", this.storedSelectionsFilter.name);
    },

    removeFilter(filter) {
      this.customFilters = this.customFilters.filter(customFilter => {
        return JSON.stringify(customFilter) !== JSON.stringify(filter);
      });

      if (this.customFilters.length == 0) {
        this.storedSelectionsFilter = {};
      }
    },

    resetFilters() {
      this.customFilters = [];
      this.storedSelectionsFilter = null;
    },

    changeFilterCategory(selectedCategory) {
      this.showStoredFilters = selectedCategory === "stored_selections";
      this.$emit("filterCategoryChanged", selectedCategory);
    },

    changeFilterSearch(searchTerm) {
      this.$emit("filterSearchInputChanged", searchTerm);
    },

    handleFilterUpdate() {
      this.$emit("savedFiltersUpdate");
    },

    handleFilterDeletion() {
      this.customFilters = [];
      this.$emit("savedFiltersUpdate");
    },

    handleFilterCreation() {
      this.$emit("filterCreated");
    },
    hideSearchInput() {
      this.hideSearchFilter = false;
    }
  },
  computed: {
    canUpdateFilter() {
      if (this.storedSelectionsFilter && this.storedSelectionsFilter.items) {
        if (this.storedSelectionsFilter.items.length !== this.customFilters.length) {
          return true;
        } else {
          return JSON.stringify(this.storedSelectionsFilter.items) !== JSON.stringify(this.customFilters);
        }
      }

      return false;
    },

    canDeleteFilter() {
      return this.storedSelectionsFilter && this.storedSelectionsFilter.items;
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
