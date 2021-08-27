<template>
  <v-container>
    <v-layout align-center justify-space-between row mb-2>
      <v-flex xs4 pt-4>
        <span>{{ $t("Contributions") }}</span>
      </v-flex>
      <v-flex xs6 class="ml-auto">
        <additionalFilters
          :categories="categories"
          :values="filterValues"
          :categoriesFilter="selectedCategory"
          @filterCategoryChanged="changeFilterCategory"
          @submitFilter="submitFilter"
          @filterSearchInputChanged="changeSearchTerm"
          @filterReset="filterReset"
          :customFilters="customFiltersByType"
          objectType="CONTRIBUTION"
        ></additionalFilters>
      </v-flex>
    </v-layout>
    <v-data-table
      :loading="loading"
      :total-items="contributionsCount"
      :pagination.sync="pagination"
      :items="contributionList"
      :headers="headers"
      class="elevation-1 pb-0"
      ref="contributionTable"
      :rows-per-page-items="rowsPerPageItems"
      :rows-per-page-text="$t('Rows per page:')"
      item-key="_id"
    >
      <template slot="items" slot-scope="props">
        <tr @click="visitContribution(props.item._id)">
          <td>
            <router-link :to="{ name: 'Contribution', params: { id: props.item._id } }" class="blue-color">
              <text-highlight :queries="highlightSearch">{{ props.item._id }} </text-highlight>
            </router-link>
          </td>
          <td class="text-xs-center">
            <text-highlight :queries="highlightSearch">{{ props.item.type }}</text-highlight>
          </td>
          <td class="text-xs-center">
            <text-highlight :queries="highlightSearch">{{ props.item.software }}</text-highlight>
          </td>
          <td class="text-xs-center">
            <router-link :to="{ name: 'Contribution', params: { id: props.item._id } }" class="blue-color">
              <text-highlight :queries="highlightSearch">
                {{ props.item.name }}
              </text-highlight>
            </router-link>
          </td>
          <td class="text-xs-center">
            <text-highlight :queries="highlightSearch">{{ props.item.author }}</text-highlight>
          </td>
          <td class="text-xs-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on">{{ props.item.timestamps.updatedAt | relativeTime(userLanguage) }}</span>
              </template>
              <span>{{ props.item.timestamps.updatedAt | formatDateFilter("llll", userLanguage) }}</span>
            </v-tooltip>
          </td>
          <td class="text-xs-center">
            <text-highlight :queries="highlightSearch">{{
              props.item.creation | formatDateFilter("ll", userLanguage)
            }}</text-highlight>
          </td>
          <td class="text-xs-center">
            <contributionStatus :status="props.item.status" :query="highlightSearch"></contributionStatus>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import contributionStatus from "@/components/contribution/ContributionStatus";
import { CONTRIBUTION_TYPES, CONTRIBUTION_STATUS, USER_TYPE, CATEGORIES_CONTRIBUTIONS_FILTERS } from "@/constants";
import { getContributionStatus } from "@/services/helpers/contribution";
import { isInsensitiveEqual, InsensitiveInclude } from "@/services/helpers/string";
import { mapGetters, createNamespacedHelpers } from "vuex";
import { LOCALE } from "@/i18n/constants";
import { routeNames } from "@/router";
const { mapState } = createNamespacedHelpers("contribution");
import additionalFilters from "@/components/filter/AdditionalFilters";

export default {
  data() {
    return {
      loading: false,
      headers: [
        { text: this.$i18n.t("Contribution N°"), value: "_id" },
        { text: this.$i18n.t("Type"), value: "type" },
        { text: this.$i18n.t("Software"), value: "software" },
        { text: this.$i18n.t("Title"), value: "name" },
        { text: this.$i18n.t("Author"), value: "author" },
        { text: this.$i18n.t("Updated"), value: "update" },
        { text: this.$i18n.t("Created"), value: "creation" },
        { text: this.$i18n.t("Status"), value: "status" }
      ],
      selectedCategory: null,
      keyValueFilter: false,
      filterValues: [],
      search: null,
      customFilters: []
    };
  },
  methods: {
    loadContributions() {
      this.loading = true;
      this.$store
        .dispatch("contribution/fetchContributions")
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Error while loading contributions"),
            color: "error"
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    submitFilter() {
      const query = {};

      query.a = this.getQueryAdditionalFilters;
      this.$router.push({ name: routeNames.CONTRIBUTIONS, query });
    },

    visitContribution(id) {
      this.$router.push({ name: "Contribution", params: { id } });
    },

    changeFilterCategory(category) {
      this.selectedCategory = category;
    },

    changeSearchTerm(searchTerm) {
      this.search = searchTerm;
    },

    filterReset() {
      this.customFilters = [];
      this.search = null;
      this.selectedCategory = null;
    },

    updateCustomFilters(customFilters) {
      this.customFilters = customFilters;
    }
  },
  computed: {
    ...mapGetters({
      contributionsCount: "contribution/getContributionsCount",
      contributions: "contribution/getContributions",
      getUserLanguage: "configuration/getUserLanguage",
      software: "software/getSoftwareList",
      getQueryAdditionalFilters: "filter/queryAdditionalFilters"
    }),

    customFiltersByType() {
      return this.$store.getters["filter/customFiltersByType"]("CONTRIBUTION");
    },

    categories() {
      let categories = Object.keys(CATEGORIES_CONTRIBUTIONS_FILTERS).map(category => ({
        key: category,
        value: this.$i18n.t(CATEGORIES_CONTRIBUTIONS_FILTERS[category])
      }));

      if (this.customFiltersByType) {
        categories.unshift({ key: "custom_filters", value: this.$i18n.t("Stored selections") });
      }

      return categories;
    },

    softwareList() {
      return (this.software || []).map(({ _id, name }) => ({ id: _id, name }));
    },

    statusList() {
      return Object.keys(CONTRIBUTION_STATUS).map(statusName => ({
        id: CONTRIBUTION_STATUS[statusName],
        name: this.$i18n.t(CONTRIBUTION_STATUS[statusName])
      }));
    },

    typeList() {
      return Object.keys(CONTRIBUTION_TYPES).map(type => ({
        id: type,
        name: this.$i18n.t(CONTRIBUTION_TYPES[type])
      }));
    },

    highlightSearch() {
      return this.search || "";
    },

    pagination: {
      get: function() {
        return this.$store.getters["contribution/pagination"];
      },
      set: function(value) {
        this.$store.dispatch("contribution/setPagination", value);
      }
    },

    ...mapState({
      rowsPerPageItems: state => state.pagination.rowsPerPageItems
    }),

    contributionList() {
      let contributionList = [...this.contributions];
      const { type, software, author, status } = CATEGORIES_CONTRIBUTIONS_FILTERS;

      if (this.customFilters.length) {
        this.customFilters.map(customFilter => {
          if (customFilter.category === type) {
            contributionList = contributionList.filter(contribution => contribution.type === customFilter.value);
          }

          if (customFilter.category === software) {
            contributionList = contributionList.filter(
              contribution => contribution.software && isInsensitiveEqual(contribution.software, customFilter.value)
            );
          }

          if (customFilter.category === author) {
            contributionList = contributionList.filter(
              contribution => contribution.author && isInsensitiveEqual(contribution.author, customFilter.value)
            );
          }

          if (customFilter.category === status) {
            contributionList = contributionList.filter(
              contribution => getContributionStatus(contribution.status) === customFilter.value
            );
          }
        });
      }

      if (this.search && this.search.length) {
        contributionList = contributionList.filter(contribution => {
          return (
            InsensitiveInclude(contribution._id.toString(), this.search) ||
            InsensitiveInclude(contribution.type, this.search) ||
            InsensitiveInclude(contribution.name, this.search) ||
            InsensitiveInclude(contribution.software, this.search) ||
            InsensitiveInclude(contribution.author, this.search) ||
            InsensitiveInclude(getContributionStatus(contribution.status), this.search)
          );
        });
      }

      return contributionList;
    },

    users() {
      const users = this.$store.getters["users/getUsersByType"](USER_TYPE.EXPERT);

      return (users || []).map(user => ({ name: user.name, id: user.user }));
    },
    userLanguage() {
      return this.getUserLanguage || LOCALE;
    }
  },
  components: {
    contributionStatus,
    additionalFilters
  },
  watch: {
    pagination: {
      handler() {
        this.loadContributions();
      },
      deep: true
    },

    selectedCategory() {
      try {
        switch (this.selectedCategory) {
          case "type":
            this.keyValueFilter = true;
            this.filterValues = [...this.typeList];
            break;
          case "software":
            this.keyValueFilter = false;
            this.filterValues = [...this.softwareList];
            break;
          case "author":
            this.keyValueFilter = false;
            this.filterValues = [...this.users];
            break;
          case "status":
            this.keyValueFilter = true;
            this.filterValues = [...this.statusList];
            break;
        }
      } catch (error) {
        // Continue
      } finally {
        let selectedCategoryCustomFilters = this.customFilters.filter(
          filter => filter.category === this.selectedCategory
        );

        this.filterValues = this.filterValues.filter(value => {
          return !selectedCategoryCustomFilters.find(
            loadedCustomFilter =>
              loadedCustomFilter.value === value || (value.key && value.key === loadedCustomFilter.value)
          );
        });
      }
    }
  },
  created() {
    this.$store.dispatch("users/fetchUsers");
    this.$store.dispatch("software/fetchSoftwareList");
    this.$store.dispatch("contribution/resetContributions");

    if (this.$route.query.a) {
      const filtersParams = JSON.parse(this.$route.query.a);
      const filters = Object.entries(filtersParams).reduce((filtersList, [category, filters]) => {
        filtersList = [...filtersList, ...filters.map(filter => ({ category, value: filter }))];
        return filtersList;
      }, []);

      this.$store.dispatch("filter/resetAdditionalFilter");
      filters.map(filter => this.$store.dispatch("filter/addAdditionalFilter", filter));
    } else {
      this.$store.dispatch("filter/resetAdditionalFilter");
    }
  }
};
</script>

<style lang="stylus" scoped>
.action-links {
  text-decoration: none;
  color: grey;
}

.progress-arrow {
  font-size: 3.5em;
  display: block;
}

.information {
  padding: 0px;
}

.subject-text {
  white-space: pre-line;
}

.related-contributions-list {
  height: 35px !important;
}

.container {
  max-width: 100% !important;
  padding: 0px;
}

.flex.xs8.pr-5 {
  padding-right: 10px !important;
}

.container.grid-list-md .layout .flex {
  padding: 15px;
}

.grid-list-md > div:nth-child(1) {
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.xs7 {
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-top: 24px !important;
}

div.wrap:nth-child(2) > div:nth-child(2) {
  padding-left: 26px !important;
  padding-right: 0px !important;
  padding-top: 20px !important;
  padding-bottom: 24px !important;
}

div.wrap:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) {
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-top: 0px !important;
  padding-bottom: 24px !important;
}

div.xs12:nth-child(2) {
  padding-top: 2px !important;
  padding-right: 0px !important;
  padding-left: 0px !important;
  padding-bottom: 24px !important;
}

div.wrap:nth-child(2), div.wrap:nth-child(2) > div:nth-child(2) > div:nth-child(1) {
  margin: 0px !important;
}
</style>
