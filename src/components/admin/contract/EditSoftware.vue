<template>
  <v-card class="mt-4 px-4">
    <v-card-title primary-title class="pl-0">
      <v-layout row justify-space-between>
        <h3 class="title mb-0">{{ $t("Software") }}</h3>
        <v-btn small flat class="pl-4 success--text" @click="show" v-if="!isEdit">
          <v-icon class="success--text">add_circle</v-icon>
          {{ $t("Add") }}
        </v-btn>
      </v-layout>
    </v-card-title>
    <v-data-table :items="software" :headers="softwareHeaders" hide-actions>
      <template v-slot:items="props">
        <td class="text-xs-center">
          {{ props.item.name }}
          <expired-label :expirationDate="props.item.SupportDate.end"></expired-label>
        </td>
        <td class="text-xs-center">{{ props.item.version }}</td>
        <td class="text-xs-center">{{ props.item.os }}</td>
        <td class="text-xs-center">
          <v-chip :color="critColor(props.item.critical)" :text-color="critTextColor(props.item.critical)" label>{{
            $t(props.item.critical)
          }}</v-chip>
        </td>
        <td class="text-xs-center" v-if="configuration.isLinInfoSecEnabled && islinInfoSecEnabledForContract">
          <span>
            {{ props.item.lininfosecConfiguration.join(", ") }}
          </span>
        </td>
        <td class="text-xs-center">
          <div v-if="props.item.SupportDate.start.length && props.item.SupportDate.end.length">
            {{ $t("S") }}: {{ props.item.SupportDate.start }}
            <br />
            {{ $t("E") }}: {{ props.item.SupportDate.end }}
          </div>
          <div v-else>
            {{ $t("contract in progress") }}
          </div>
        </td>
        <td class="text-xs-center">
          <ul class="list">
            <li
              v-for="(referent, key) in props.item.technicalReferent && props.item.technicalReferent"
              :key="key"
              class="chips-elements"
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <router-link :to="{ name: routeNames.PROFILE, params: { id: referent.id } }">
                      {{ referent.name }}
                    </router-link>
                  </span>
                </template>
                <span>
                  {{ referent.email }}
                </span>
              </v-tooltip>
            </li>
          </ul>
        </td>
        <td class="text-xs-center">
          <v-btn color="primary" flat small @click="editSoftware(props)">
            <v-icon>edit</v-icon>
            {{ $t("edit") }}
          </v-btn>
          <v-btn color="error" flat small @click="deleteSoftware(props.item)">
            <v-icon>remove_circle</v-icon>
            {{ $t("remove") }}
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-btn small flat class="pl-4 success--text" @click="show" v-if="!isEdit">
      <v-icon class="success--text">add_circle</v-icon>
      {{ $t("Add") }}
    </v-btn>
    <v-layout class="mt-4 pb-2" row wrap align-center>
      <v-dialog v-model="formDialog" scrollable :fullscreen="$vuetify.breakpoint.xs" persistent max-width="600px">
        <form-software
          :software="newSoftware"
          :editing="isEdit"
          :isModalOpen="formDialog"
          @submit="submit"
          @closeFormModal="closeFormModal"
          :islinInfoSecEnabled="contract.features && contract.features.linInfoSec"
        ></form-software>
      </v-dialog>

      <v-dialog v-model="deleteModal" persistent max-width="300">
        <v-card class="px-4 pt-2">
          <v-card-text>
            <span class="body-2">{{ $t("Are you sure you want to remove the software") }} ?</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="confirmDeleteSoftware">{{ $t("confirm") }}</v-btn>
            <v-btn color="error" @click="deleteModal = false">{{ $t("cancel") }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <br />
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import FormSoftware from "@/components/admin/contract/FormSoftware.vue";
import ExpiredLabel from "@/components/ExpiredLabel.vue";
import SoftwareMixin from "@/mixins/SortContractSoftware";
import { routeNames } from "@/router";

export default {
  name: "edit-contract-software",
  mixins: [SoftwareMixin],
  data() {
    return {
      formDialog: false,
      newSoftware: {
        software: {},
        critical: "standard",
        technicalReferent: [],
        os: "",
        version: "",
        SupportDate: {
          start: "",
          end: ""
        }
      },
      contract: {},
      isEdit: false,
      selectedItem: {},
      deleteModal: false
    };
  },
  components: {
    FormSoftware,
    ExpiredLabel
  },
  methods: {
    closeFormModal() {
      this.formDialog = false;
      this.isEdit = false;
    },
    show() {
      this.formDialog = true;
    },
    editSoftware({ item: softwareItem }) {
      this.isEdit = true;
      this.formDialog = true;
      this.selectedItem = softwareItem;
      this.newSoftware = {
        ...this.selectedItem
      };
    },
    deleteSoftware(selectedSoftware) {
      this.deleteModal = true;
      this.selectedItem = selectedSoftware;
    },
    confirmDeleteSoftware() {
      const filteredList = this.contract.software.filter(
        softwareItem =>
          this.selectedItem.version !== softwareItem.version ||
          this.selectedItem.name !== softwareItem.software.name ||
          this.selectedItem.os !== softwareItem.os
      );

      this.$set(this.contract, "software", filteredList);
      this.doRequest("Deleted");
    },
    submit(software) {
      const toastMsg = this.isEdit ? "Updated" : "Added";
      if (this.isEdit) {
        // eslint-disable-next-line no-unused-vars
        const { name, ...normalizedSoftware } = this.selectedItem;
        const softwareIdx = this.contract.software.findIndex(
          software => JSON.stringify(software) == JSON.stringify(normalizedSoftware)
        );

        delete software.name;

        this.$set(this.contract.software, softwareIdx, software);
      } else {
        this.contract.software.push(Object.assign({}, software));
      }
      this.doRequest(toastMsg);
    },
    doRequest(toastMsg) {
      this.$http
        .updateContract(this.contract._id, this.contract)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t(toastMsg),
            color: "success"
          });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
      this.formDialog = false;
      this.isEdit = false;
      this.deleteModal = false;
    },
    critColor(critLevel) {
      switch (critLevel) {
        case "critical":
          return "#f44336";
        case "sensible":
          return "#f4b336";
        case "standard":
          return "#e0e0e0";

        default:
          return "";
      }
    },
    critTextColor(critLevel) {
      switch (critLevel) {
        case "critical":
        case "sensible":
          return "white";
        default:
          return "black";
      }
    }
  },
  computed: {
    ...mapGetters({
      configuration: "configuration/getConfiguration"
    }),
    softwareHeaders() {
      let softwareHeaders = [
        { text: this.$i18n.t("Software"), value: "name" },
        { text: this.$i18n.t("Version"), value: "version" },
        { text: this.$i18n.t("OS"), value: "os" },
        { text: this.$i18n.t("Critical"), value: "critical" },
        {
          text: this.$i18n.t("CPE"),
          value: "lininfosecConfiguration",
          sortable: false
        },
        {
          text: this.$i18n.t("Support date"),
          value: "supportDate"
        },
        {
          text: this.$i18n.t("Tech. referent"),
          value: "technicalReferent"
        },
        { text: "", value: "delete" }
      ];

      if (this.configuration.isLinInfoSecEnabled && !this.islinInfoSecEnabledForContract) {
        return softwareHeaders.filter(header => header.value !== "lininfosecConfiguration");
      }

      return softwareHeaders;
    },
    software() {
      return this.sortSoftware(this.contract.software).map(item => ({ ...item, name: item.software.name }));
    },
    islinInfoSecEnabledForContract() {
      return this.contract.features && this.contract.features.linInfoSec;
    },

    routeNames() {
      return routeNames;
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.$http
        .getContractById(this.$route.params.id)
        .then(response => {
          this.contract = response.data;
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
ul.list {
  list-style: none;
}
</style>
