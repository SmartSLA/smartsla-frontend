<template>
  <v-container class="pa-0" v-if="$auth.ready() && $auth.check('admin')">
    <div class="page-title">
      <span>{{ $t("Software list") }}</span>
    </div>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12 xl12 mb-1>
        <v-text-field
          v-model="search"
          :placeholder="$i18n.t('Search')"
          single-line
          hide-details
          solo
          append-icon="search"
          class="softwares-search-name"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout justify-end>
      <v-btn flat :to="{ name: 'NewSoftware' }">
        <v-icon class="mr-2">add_circle</v-icon>
        {{ $t("Add new software") }}
      </v-btn>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="software"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      class="elevation-1"
      :search="search"
      :rows-per-page-text="$t('Rows per page:')"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.logo }}</td>
        <td class="text-xs-center">
          <router-link :to="{ name: 'Software', params: { id: props.item._id } }" class="blue-color">{{
            props.item.name
          }}</router-link>
        </td>
        <td class="text-xs-center">{{ props.item.description }}</td>
        <td class="text-xs-center">{{ props.item.technology || $t("Not specified") }}</td>
        <td class="text-xs-center">{{ props.item.group }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      search: "",
      contact: [],
      rowsPerPageItems: [10, 25, 50],
      pagination: {
        rowsPerPage: 10
      },
      headers: [
        {
          text: this.$i18n.t("Logo"),
          value: "logo",
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
          text: this.$i18n.t("Description"),
          value: "description",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Technologies"),
          value: "technologies",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Group"),
          value: "group",
          sortable: false,
          class: "text-xs-center"
        }
      ],
      softwares: []
    };
  },
  computed: {
    ...mapGetters({
      software: "software/getSoftwareList"
    })
  },
  mounted() {
    this.$store.dispatch("software/fetchSoftwareList", { sortBy: "name" });
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  }
};
</script>

<style lang="stylus" scoped>
.page-title {
  color: #777777;
  margin-bottom: 24px;
}

.elevation-1 th {
  color: #000000;
}

.softwares-list {
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

.softwares-search-span {
  padding-top: 15px;
  width: 150px;
  color: #777;
}

.softwares-search {
  display: inline-flex !important;
  margin-bottom: 24px;
}

.user-mail {
  color: #2195f2 !important;
  font-weight: bold !important;
}

.softwares-operations a {
  margin-left: 20px;
}

.softwares-operations {
  margin: 10px;
  margin-left: 100px !important;
  display: flex;
}

.softwares-actions {
  text-decoration: none !important;
  display: flex;
}

.softwares-actions span {
  margin-top: 3.75px;
  margin-left: 2px;
}

.softwares-search {
  width: 100% !important;
}
</style>
