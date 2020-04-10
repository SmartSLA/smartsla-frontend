<template>
  <v-container grid-list-md>
    <dataTableFilter
      :categories="categories"
      :values="filterValues"
      :categoriesFilter="selectedCategory"
      :keyValueFilter="keyValueFilter"
      @customFiltersUpdated="updateCustomFilters"
      @filterCategoryChanged="changeFilterCategory"
      @filterSearchInputChanged="changeSearchTerm"
      @filterReset="filterReset"
    ></dataTableFilter>
    <v-data-table
      :loading="loading"
      :total-items="contributionsCount"
      :pagination.sync="pagination"
      :items="contributionList"
      :headers="headers"
      class="elevation-1 pb-0"
      :rows-per-page-items="rowsPerPageItems"
      :rows-per-page-text="$t('Rows per page:')"
      item-key="_id"
    >
      <template slot="items" slot-scope="props">
        <tr @click="visitContribution(props.item._id)">
          <td>
            <router-link :to="{ name: 'Contribution', params: { id: props.item._id } }" class="blue-color">{{
              props.item._id
            }}</router-link>
          </td>
          <td class="text-xs-center">{{ props.item.type }}</td>
          <td class="text-xs-center">{{ props.item.software.name }}</td>
          <td>
            <router-link :to="{ name: 'Contribution', params: { id: props.item._id } }" class="blue-color">{{
              props.item.name
            }}</router-link>
          </td>
          <td class="text-xs-center">{{ props.item.author && props.item.author.name }}</td>
          <td class="text-xs-center">{{ props.item.timestamps.update }}</td>
          <td class="text-xs-center">{{ props.item.timestamps.creation | formatDateFilter("ll") }}</td>
          <td class="text-xs-center">
            <contributionStatus :status="props.item.status"></contributionStatus>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import contributionStatus from "@/components/contribution/ContributionStatus";
import dataTableFilter from "@/components/filter/Filter";
import { CONTRIBUTION_TYPES, CONTRIBUTION_STATUS, USER_TYPE, CONTRIBUTION_FILTERS } from "@/constants";
import { getContributionStatus } from "@/services/helpers/contribution";
import { isInsensitiveEqual, InsensitiveInclude } from "@/services/helpers/string";
import { mapGetters, createNamespacedHelpers } from "vuex";

const { mapState } = createNamespacedHelpers("contribution");

export default {
  data() {
    return {
      loading: false,
      headers: [
        { text: this.$i18n.t("Contribution N°"), value: "_id" },
        { text: this.$i18n.t("Type"), value: "type" },
        { text: this.$i18n.t("Software"), value: "software.name" },
        { text: this.$i18n.t("Title"), value: "name" },
        { text: this.$i18n.t("Author"), value: "author.name" },
        { text: this.$i18n.t("Updated"), value: "update" },
        { text: this.$i18n.t("Created"), value: "creation" },
        { text: this.$i18n.t("Status"), value: "status" }
      ],
      categories: Object.keys(CONTRIBUTION_FILTERS).map(category => ({
        key: CONTRIBUTION_FILTERS[category],
        value: this.$i18n.t(CONTRIBUTION_FILTERS[category])
      })),
      statusList: Object.keys(CONTRIBUTION_STATUS).map(statusName => ({
        key: CONTRIBUTION_STATUS[statusName],
        value: this.$i18n.t(CONTRIBUTION_STATUS[statusName])
      })),
      software: [],
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
      contributions: "contribution/getContributions"
    }),

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

      if (this.customFilters.length) {
        this.customFilters.map(customFilter => {
          if (customFilter.category === CONTRIBUTION_FILTERS.TYPE) {
            contributionList = contributionList.filter(contribution => contribution.type === customFilter.value);
          }

          if (customFilter.category === CONTRIBUTION_FILTERS.SOFTWARE) {
            contributionList = contributionList.filter(
              contribution =>
                contribution.software && isInsensitiveEqual(contribution.software.name, customFilter.value)
            );
          }

          if (customFilter.category === CONTRIBUTION_FILTERS.AUTHOR) {
            contributionList = contributionList.filter(
              contribution => contribution.author && isInsensitiveEqual(contribution.author, customFilter.value)
            );
          }

          if (customFilter.category === CONTRIBUTION_FILTERS.STATUS) {
            contributionList = contributionList.filter(
              contribution => getContributionStatus(contribution.status) === customFilter.value
            );
          }
        });
      }

      if (this.search && this.search.length) {
        contributionList = contributionList.filter(contribution => {
          return (
            InsensitiveInclude(contribution.name, this.search) ||
            InsensitiveInclude(contribution.software.name, this.search) ||
            InsensitiveInclude(contribution.author.name, this.search)
          );
        });
      }

      return contributionList;
    },

    users() {
      return this.$store.getters["users/getUsersByType"](USER_TYPE.EXPERT);
    }
  },
  components: {
    contributionStatus,
    dataTableFilter
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
          case CONTRIBUTION_FILTERS.TYPE:
            this.keyValueFilter = true;
            this.filterValues = CONTRIBUTION_TYPES;
            break;
          case CONTRIBUTION_FILTERS.SOFTWARE:
            this.keyValueFilter = false;
            this.filterValues = [...this.software];
            break;
          case CONTRIBUTION_FILTERS.AUTHOR:
            this.keyValueFilter = false;
            this.filterValues = [...this.users];
            break;
          case CONTRIBUTION_FILTERS.STATUS:
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
  mounted() {
    this.$http
      .listSoftware({})
      .then(({ data }) => {
        this.software = data.map(software => software.name);
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          color: "error",
          message: this.$i18n.t("Failed to fetch softwares")
        });
      });

    this.$store.dispatch("users/fetchUsers");
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
