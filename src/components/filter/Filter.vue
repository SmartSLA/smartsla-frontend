<template>
  <div>
    <v-layout column mb-3 mt-4 class="filter_layout">
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
        <v-dialog v-model="dialog" width="700" overflow="false" persistent>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              v-on="on"
              @click="hideFilter = true"
              :class="{ 'v-btn--active': hideFilter == true || customFilters.length > 0 }"
            >
              <v-icon :color="colorFiltersIcon">
                filter_list
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="light-blue">
              <v-card-title class="lighten-2" primary-title>
                {{ $t("Filter by") }}
              </v-card-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeFilter" class="mr-3">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-layout :column="!sizeFilterDevice">
                <v-flex xs12 md6 lg6 v-if="hideFilter == true">
                  <FilterCategories
                    :categories="categories"
                    @filterCategoryChanged="changeFilterCategory"
                  ></FilterCategories>
                </v-flex>
                <v-flex xs12 sm5 md6 lg6 mb-4 v-if="hideFilter == true">
                  <v-toolbar flat dense v-if="!showStoredFilters">
                    <v-layout align-center justify-end>
                      <v-overflow-btn
                        v-if="keyValueFilter"
                        :items="values"
                        :label="$t('Values')"
                        v-model="valuesFilter"
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
                  <FilterLoader v-else :savedFilters="savedFilters" @filterLoaded="loadFilter"></FilterLoader> </v-flex
              ></v-layout>
              <FilterActions
                :savedFilters="savedFilters"
                :customFilters="customFilters"
                :storedSelectionsFilter="storedSelectionsFilter"
                :canDelete="canDeleteFilter"
                :canUpdate="canUpdateFilter"
                :hideFilter="hideFilter"
                @filterReset="resetFilters"
                @removeFilter="removeFilter"
                @filterUpdated="handleFilterUpdate"
                @filterDeleted="handleFilterDeletion"
                @filterCreated="handleFilterCreation"
              ></FilterActions>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-layout>
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
      hideSearchFilter: false,
      hideFilter: false,
      hasError: false,
      dialog: false
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
    },
    closeFilter() {
      this.dialog = this.hideFilter = false;
    }
  },
  computed: {
    colorFiltersIcon() {
      return this.customFilters.length ? "primary" : "";
    },

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
    },

    sizeFilterDevice() {
      return this.$vuetify.breakpoint.width >= 960 ? true : false;
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
 .v-text-field.v-overflow-btn {
    margin-top: 0;
    padding-top: 0;
 }
</style>
