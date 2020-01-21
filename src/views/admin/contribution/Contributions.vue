<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="contributions-list">
      <div class="page-title">
        <span>{{ $t("Contributions list") }}</span>
      </div>
      <div class="contributions-search">
        <span class="contributions-search-span">{{ $t("Search by:") }}</span>
        <v-text-field
          v-model="search"
          :placeholder="$i18n.t('Name')"
          single-line
          hide-details
          solo
          class="contributions-search-name"
        ></v-text-field>
        <v-select
          solo
          :items="softwareList"
          v-model="software"
          item-text="name"
          hide-details
          :label="$i18n.t('software')"
          :no-data-text="$i18n.t('No data available')"
          class="contributions-search-software"
          return-object
        ></v-select>
        <v-select
          solo
          :items="statusList"
          v-model="status"
          hide-details
          :label="$i18n.t('status')"
          :no-data-text="$i18n.t('No data available')"
          class="contributions-search-statuss"
        ></v-select>
        <div class="contributions-operations">
          <router-link :to="{ name: 'NewContribution' }" class="contributions-actions blue-color">
            <v-icon>add_circle</v-icon>
            <span>{{ $t("Add contribution") }}</span>
          </router-link>
          <a href="#" class="contributions-actions blue-color">
            <v-icon>arrow_downward</v-icon>
            <span>{{ $t("Export") }}</span>
          </a>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="contributionList"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        class="elevation-1"
        :search="search"
        :rows-per-page-text="$t('Rows per page:')"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.software.name }}</td>
          <td class="text-xs-center">
            <router-link :to="{ name: 'AdminContribution', params: { id: props.item._id } }" class="blue-color">{{
              props.item.name
            }}</router-link>
          </td>
          <td class="text-xs-center">{{ props.item.status }}</td>
          <td class="text-xs-center">{{ props.item.deposedAt }}</td>
          <td class="text-xs-center">{{ props.item.updated }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { CONTRIBUTION_STATUS_LIST } from "@/constants.js";

export default {
  data() {
    return {
      search: "",
      software: {},
      softwareList: [],
      status: "",
      statusList: CONTRIBUTION_STATUS_LIST.map(contributionStatus => ({
        key: contributionStatus,
        value: this.$i18n.t(contributionStatus)
      })),
      rowsPerPageItems: [10, 25, 50],
      pagination: {
        rowsPerPage: 10
      },
      headers: [
        {
          text: this.$i18n.t("Software"),
          value: "software",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Name"),
          value: "name",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Status"),
          value: "status",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Deposit at"),
          value: "deposit",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Updated at"),
          value: "updated",
          sortable: false,
          class: "text-xs-center"
        }
      ],
      contributions: []
    };
  },
  computed: {
    contributionList() {
      let filteredContributions = this.contributions;

      if (this.software && this.software._id) {
        filteredContributions = filteredContributions.filter(
          contribution => contribution.software && contribution.software._id === this.software._id
        );
      }

      if (this.status && this.status.length) {
        filteredContributions = filteredContributions.filter(contribution => contribution.status === this.status);
      }

      return filteredContributions;
    }
  },

  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  },

  created() {
    this.$http
      .getContributions()
      .then(({ data }) => {
        this.contributions = data;
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("cannot fetch contribution list"),
          color: "error"
        });
      });

    this.$http
      .listSoftware({})
      .then(({ data }) => {
        this.softwareList = data;
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("cannot fetch software list"),
          color: "error"
        });
      });
  }
};
</script>

<style lang="stylus" scoped>
.elevation-1 th {
  color: #000000;
}

.page-title {
  color: #777777;
  margin-bottom: 24px;
}

.contributions-list {
  width: 100% !important;
}

.container.fluid.fill-height {
  padding: 50px;
  width: 100%;
  max-width: 100%;
}

.layout.justify-center.align-center > div {
  width: 100%;
}

.contributions-search-span {
  padding-top: 15px;
  width: 150px;
  color: #777;
}

.contributions-search-name, .contributions-search-software, .contributions-search-statuss {
  width: 300px;
}

.contributions-search {
  display: inline-flex !important;
  margin-bottom: 24px;
}

.v-input.contributions-search-name, .v-input.contributions-search-software {
  margin-right: 20px !important;
}

.contributions-operations a {
  margin-left: 20px;
}

.contributions-operations {
  margin: 10px;
  margin-left: 100px !important;
  display: flex;
}

.contributions-actions {
  text-decoration: none !important;
  display: flex;
}

.contributions-actions span {
  margin-top: 3.75px;
  margin-left: 2px;
}

.contributions-search {
  width: 100%;
}
</style>
