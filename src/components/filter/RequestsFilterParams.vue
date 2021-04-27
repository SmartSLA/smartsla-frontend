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
              :class="{ 'v-btn--active': hideFilter == true || additionalFilters.length > 0 }"
            >
              <v-icon :color="colorFiltersIcon"> filter_list </v-icon>
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
                  <v-toolbar flat dense>
                    <v-layout align-center justify-end>
                      <v-overflow-btn
                        :items="getSortedValues"
                        :label="$t('Values')"
                        :no-data-text="$t('No data available')"
                        v-model="valuesFilter"
                        item-text="name"
                        return-object
                        flat
                        hide-details
                        hide-selected
                        editable
                      ></v-overflow-btn>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-toolbar-side-icon v-on="on" @click="addFilter">
                            <v-icon dark>add</v-icon>
                          </v-toolbar-side-icon>
                        </template>
                        <span>
                          {{ $t("This button allows you to add an additional filter to the board") }}
                        </span>
                      </v-tooltip>
                    </v-layout>
                  </v-toolbar>
                </v-flex>
              </v-layout>
              <v-layout justify-space-between row>
                <ul>
                  <li v-for="(filter, key) in additionalFilters" :key="key" class="chips-elements">
                    <v-chip @input="removeFilter(filter)" close
                      >{{ $t(getCategorieLabel(filter.category)) }} : {{ $t(capitalize(filter.value.name)) }}</v-chip
                    >
                  </li>
                </ul>
              </v-layout>
              <v-layout justify-space-between row>
                <div>
                  <!-- <v-btn flat small color="primary">
                    <v-icon>add</v-icon>
                    <div class="ml-2 hidden-sm-and-down">{{ $t("Create new filter") }}</div>
                  </v-btn> -->
                  <v-btn flat small color="warning" @click="resetFilters" v-if="!!additionalFilters.length">
                    <v-icon>refresh</v-icon>
                    <div class="ml-2 hidden-sm-and-down">{{ $t("reset") }}</div>
                  </v-btn>
                </div>
                <div>
                  <v-btn small color="primary" @click="submitFilters">
                    <div class="ml-2">{{ $t("Apply") }}</div>
                  </v-btn>
                </div>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-layout>
  </div>
</template>
<script>
import FilterCategories from "@/components/filter/FilterCategories";
import FilterSearchInput from "@/components/filter/FilterSearchInput";
import { SORT_FILTERS_KEYS, CATEGORIES_REQUESTS_FILTERS } from "@/constants.js";
import { capitalize } from "lodash";

export default {
  name: "requestsFilterParams",
  components: {
    FilterCategories,
    FilterSearchInput
  },

  data() {
    return {
      valuesFilter: null,
      hideSearchFilter: false,
      hideFilter: false,
      hasError: false,
      dialog: false
    };
  },

  props: {
    categoriesFilter: null,
    categories: null,
    values: null
  },

  methods: {
    addFilter() {
      if (this.categoriesFilter && this.valuesFilter) {
        let filter = {
          category: this.categoriesFilter,
          value: this.valuesFilter
        };
        this.$store.dispatch("filter/addAdditionalFilter", filter);
      }
    },

    getCategorieLabel(category) {
      return CATEGORIES_REQUESTS_FILTERS[category];
    },

    removeFilter(filter) {
      this.$store.dispatch("filter/removeAdditionalFilter", filter);
    },

    resetFilters() {
      this.$store.dispatch("filter/resetAdditionalFilter");
    },

    changeFilterCategory(selectedCategory) {
      this.$emit("filterCategoryChanged", selectedCategory);
    },

    handleFilterCreation() {
      this.$emit("filterCreated");
    },

    hideSearchInput() {
      this.hideSearchFilter = false;
    },

    closeFilter() {
      this.dialog = this.hideFilter = false;
    },

    submitFilters() {
      this.$emit("submitFilter");
    },

    capitalize(value) {
      return capitalize(value);
    },

    changeFilterSearch(searchTerm) {
      this.$emit("filterSearchInputChanged", searchTerm);
    }
  },
  computed: {
    additionalFilters() {
      return this.$store.getters["filter/additionalFilters"];
    },

    colorFiltersIcon() {
      return this.additionalFilters.length ? "primary" : "";
    },

    sizeFilterDevice() {
      return this.$vuetify.breakpoint.width >= 960 ? true : false;
    },

    getSortedValues() {
      if (SORT_FILTERS_KEYS.includes(this.categoriesFilter)) {
        return ([...this.values] || []).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      }
      return this.values;
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
