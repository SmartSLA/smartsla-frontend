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
              <v-layout :class="{ 'mb-4': !showSelectedFilter }" :column="!sizeFilterDevice">
                <v-flex xs12 md6 lg6 v-if="hideFilter == true">
                  <FilterCategories
                    :categories="categories"
                    @filterCategoryChanged="changeFilterCategory"
                  ></FilterCategories>
                </v-flex>
                <v-flex xs12 sm5 md6 lg6 v-if="hideFilter == true">
                  <v-toolbar v-if="!showCustomFilters" flat dense>
                    <v-layout align-center justify-end>
                      <v-overflow-btn
                        :items="getSortedValues"
                        :label="$t('Values')"
                        :no-data-text="$t('No data available')"
                        v-model="valuesFilter"
                        item-text="name"
                        item-value="id"
                        return-object
                        flat
                        hide-details
                        hide-selected
                        editable
                      >
                        <template v-slot:item="{ item }">
                          <span>{{ item.name }}</span>
                          <v-spacer v-if="item.client"></v-spacer>
                          <span class="grey--text caption" v-if="item.client">{{ item.client }}</span>
                        </template>
                      </v-overflow-btn>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-toolbar-side-icon v-on="on" @click="addFilter">
                            <v-btn :dark="canAddFilter" color="primary" fab small :disabled="!canAddFilter">
                              <v-icon>add</v-icon>
                            </v-btn>
                          </v-toolbar-side-icon>
                        </template>
                        <span>
                          {{ $t("This button allows you to add an additional filter to the board") }}
                        </span>
                      </v-tooltip>
                    </v-layout>
                  </v-toolbar>
                  <FilterLoader
                    v-else
                    :savedFilters="customFilters"
                    @filterLoaded="onCustomFilterSelected"
                  ></FilterLoader>
                </v-flex>
              </v-layout>

              <v-layout row v-if="showSelectedFilter">
                <div class="font-weight-bold pl-2">
                  <span>{{ currentCustomFilter.name }}</span>
                  <v-menu>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on">
                        <v-badge right v-model="canUpdateCustomFilter">
                          <template v-slot:badge>
                            <v-icon dark>notifications</v-icon>
                          </template>
                          <v-icon color="grey">mdi-dots-vertical</v-icon>
                        </v-badge>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-tile :disabled="!canUpdateCustomFilter" @click="updateCustomFilter()">
                        <v-list-tile-title>{{ $t("save") }}</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile @click="deleteCustomFilter()">
                        <v-list-tile-title>
                          <span>{{ $t("Delete filter") }}</span>
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </div>
              </v-layout>

              <v-layout justify-space-between row>
                <div>
                  <ul>
                    <li v-for="(filter, key) in additionalFilters" :key="key" class="chips-elements">
                      <v-chip @input="removeFilter(filter)" close
                        >{{ $t(getCategorieLabel(filter.category)) }} : {{ $t(capitalize(filter.value.name)) }}</v-chip
                      >
                    </li>
                  </ul>
                </div>
              </v-layout>
              <v-layout justify-space-between row>
                <div>
                  <v-btn flat small color="primary" @click="createNewFilter = true" v-if="!!additionalFilters.length">
                    <v-icon>add</v-icon>
                    <div class="ml-2 hidden-sm-and-down">{{ $t("Create new filter") }}</div>
                  </v-btn>
                  <v-btn flat small color="warning" @click="resetFilters" v-if="!!additionalFilters.length">
                    <v-icon>refresh</v-icon>
                    <div class="ml-2 hidden-sm-and-down">{{ $t("reset") }}</div>
                  </v-btn>
                </div>
                <div>
                  <v-btn small color="primary" @click="submitFilters" :disabled="!additionalFilters.length">
                    <div class="ml-2">{{ $t("Apply") }}</div>
                  </v-btn>
                </div>
                <filterModal
                  v-if="createNewFilter"
                  :type="objectType"
                  :open="createNewFilter"
                  @closeModalFilter="closeModalFilter"
                ></filterModal>
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
import FilterModal from "@/components/filter/FilterModal";
import FilterLoader from "@/components/filter/FilterLoader";

export default {
  name: "additionalFilters",
  components: {
    FilterCategories,
    FilterSearchInput,
    FilterModal,
    FilterLoader
  },

  data() {
    return {
      valuesFilter: null,
      hideSearchFilter: false,
      hideFilter: false,
      hasError: false,
      dialog: false,
      createNewFilter: false,
      showCustomFilters: false,
      canAddFilter: false
    };
  },

  props: {
    categoriesFilter: null,
    categories: null,
    values: null,
    customFilters: null,
    objectType: String
  },

  methods: {
    addFilter() {
      if (this.categoriesFilter && this.valuesFilter) {
        let filter = {
          category: this.categoriesFilter,
          value: this.valuesFilter
        };
        this.$store.dispatch("filter/addAdditionalFilter", filter);
        this.valuesFilter = null;
      }
      this.canAddFilter = false;
    },

    getCategorieLabel(category) {
      return CATEGORIES_REQUESTS_FILTERS[category];
    },

    removeFilter(filter) {
      this.$store.dispatch("filter/removeAdditionalFilter", filter);
    },

    resetFilters() {
      this.$store.dispatch("filter/resetAdditionalFilter");
      this.$store.dispatch("filter/removeCurrentCustomFilter", this.objectType);
    },

    changeFilterCategory(selectedCategory) {
      this.showCustomFilters = selectedCategory === "custom_filters";
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
      if (this.additionalFilters && this.additionalFilters.length === 0) {
        this.submitFilters();
      }
    },

    submitFilters() {
      this.$emit("submitFilter");
    },

    capitalize(value) {
      return capitalize(value);
    },

    changeFilterSearch(searchTerm) {
      this.$emit("filterSearchInputChanged", searchTerm);
    },

    closeModalFilter() {
      this.createNewFilter = false;
    },

    onCustomFilterSelected(selectedFilter) {
      const { items } = selectedFilter;

      this.resetFilters();
      this.$store.dispatch("filter/setCurrentCustomFilter", { objectType: this.objectType, filter: selectedFilter });
      items.map(filter => this.$store.dispatch("filter/addAdditionalFilter", filter));
    },

    updateCustomFilter() {
      const filterUpdate = {
        ...this.currentCustomFilter,
        items: this.additionalFilters
      };

      this.$store
        .dispatch("filter/updateCustomFilter", filterUpdate)
        .then(() => {
          this.$store.dispatch("filter/setCurrentCustomFilter", { objectType: this.objectType, filter: filterUpdate });
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Filter updated"),
            color: "success"
          });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },

    deleteCustomFilter() {
      this.$store
        .dispatch("filter/deleteCustomFilter", this.currentCustomFilter._id)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Filter deleted"),
            color: "success"
          });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });

      this.$store.dispatch("filter/removeCurrentCustomFilter", this.objectType);
      this.resetFilters();
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
    },

    canUpdateCustomFilter() {
      if (this.currentCustomFilter) {
        if (this.currentCustomFilter.items.length !== this.additionalFilters.length) {
          return true;
        } else {
          return JSON.stringify(this.currentCustomFilter.items) !== JSON.stringify(this.additionalFilters);
        }
      }

      return false;
    },

    currentCustomFilter() {
      return this.$store.getters["filter/getCurrentCustomFilter"](this.objectType);
    },

    showSelectedFilter() {
      return (
        this.currentCustomFilter && !!Object.keys(this.currentCustomFilter).length && !!this.additionalFilters.length
      );
    }
  },
  created() {
    this.$store.dispatch("filter/fetchCustomFilters");
  },
  watch: {
    valuesFilter(val) {
      if (!val || val === null) {
        return;
      }

      this.canAddFilter = this.categoriesFilter && !!Object.keys(val).length;
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
