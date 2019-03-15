<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="contracts-list">
      <div class="page-title">
        <span>Contracts list</span>
      </div>

      <div class="contracts-search">
        <span class="contracts-search-span">Search by:</span>
        <v-text-field
          v-model="search"
          :placeholder="$t('Name')"
          single-line
          hide-details
          solo
          class="contracts-search-name"
        >
        </v-text-field>
        <v-select solo :items="clients" v-model="clients" hide-details label="Status" class="contracts-search-status">
        </v-select>
        <v-select solo :items="clients" v-model="clients" hide-details label="Tam" class="contracts-search-tam">
        </v-select>
        <v-select
          solo
          :items="roles"
          v-model="roles"
          hide-details
          label="Commercial"
          class="contracts-search-commercial"
        >
        </v-select>
        <v-select solo :items="clients" v-model="clients" hide-details label="Team" class="contracts-search-team">
        </v-select>
        <div class="contracts-operations">
          <a href="#">
            <v-icon>add_circle</v-icon>
            <span>Add user</span>
          </a>
          <a href="#">
            <v-icon>arrow_downward</v-icon>
            <span>Export</span>
          </a>
        </div>
      </div>

      <v-data-table :headers="headers" :items="contracts" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">
            <div v-if="props.item.isdisabled == 'yes'">
              <strike>{{ props.item.name }}</strike>
              <span class="expired-contracts">Expired</span>
            </div>
            <div v-else>
              {{ props.item.name }}
            </div>
          </td>
          <td class="text-xs-center">{{ props.item.begin }}</td>
          <td class="text-xs-center">{{ props.item.end }}</td>
          <td class="text-xs-center">
            <a href="#"><v-icon>search</v-icon></a>
          </td>
          <td class="text-xs-center">
            <a href="#"><v-icon>create</v-icon></a>
          </td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
var contracts = require("@/assets/data/contracts.json");
export default {
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Begin", value: "begin" },
        { text: "End", value: "end" },
        { text: "View", value: "view" },
        { text: "Edit", value: "edit" }
      ],
      contracts: [
        {
          name: "DGA Totem V3 (Drupal)",
          begin: "08/09/2008",
          end: "10/04/2012",
          isdisabled: "yes"
        },
        {
          name: "Easi Wal",
          begin: "28/09/2009",
          end: "08/02/2010",
          isdisabled: "yes"
        },
        {
          name: "Easi Wal wallonie.be",
          begin: "22/02/2010",
          end: "22/03/2010",
          isdisabled: "yes"
        },
        {
          name: "Reporter Sans Frontière www.rsf.org",
          begin: "01/04/2010",
          end: "30/04/2012",
          isdisabled: "yes"
        },
        {
          name: "L'Humanité site drupal",
          begin: "18/06/2010",
          end: "18/06/2011",
          isdisabled: "yes"
        },
        {
          name: "L'Humanité",
          begin: "01/05/2012",
          end: "31/03/2022",
          isdisabled: "no"
        },
        {
          name: "DGT - Club de Paris",
          begin: "17/11/2015",
          end: "19/12/2019",
          isdisabled: "no"
        }
      ]
    };
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  }
};
</script>
<style type="text/css">
.elevation-1 {
  width: 100% !important;
  padding-bottom: 50px;
  background-color: #ffffff;
}
.page-title {
  color: #777777;
  margin-bottom: 20px;
}
.elevation-1 th {
  color: #000000;
}
.contracts-list {
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
.contracts-search-span {
  padding-top: 15px;
  width: 100px;
  color: #777;
}
.contracts-search-name,
.contracts-search-status,
.contracts-search-tam,
.contracts-search-commercial,
.contracts-search-team {
  width: 200px;
}
.contracts-search {
  display: inline-flex !important;
  margin-bottom: 20px;
}
.v-input.contracts-search-name.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--enclosed.v-text-field--placeholder.v-input--hide-details.theme--light,
.v-input.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--enclosed.v-select.v-input--hide-details.theme--light {
  margin-right: 10px;
}
.user-mail {
  color: #a20000;
  font-weight: bold !important;
}
.contracts-operations a {
  margin-left: 20px;
}
.contracts-operations {
  margin: 10px;
}
.expired-contracts {
  color: #fa4b4b;
  padding: 2px;
  border: #fa4b4b solid 1px;
  border-radius: 5px;
  margin-left: 5px;
}
</style>
