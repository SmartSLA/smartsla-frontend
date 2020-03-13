<template>
  <v-card class="mt-4 px-4">
    <v-card-title primary-title class="pl-0">
      <div>
        <h3 class="title mb-0">{{ $t("Software") }}</h3>
      </div>
    </v-card-title>
    <v-data-table :items="software" :headers="softwareHeaders" hide-actions>
      <template v-slot:items="props">
        <td class="text-xs-center">
          {{ props.item.name }}
          <expired-label :expirationDate="props.item.SupportDate.end"></expired-label>
        </td>
        <td class="text-xs-center">{{ props.item.version }}</td>
        <td class="text-xs-center">{{ props.item.os }}</td>
        <td class="text-xs-center" v-if="props.item.SupportDate.start.length && props.item.SupportDate.start.length">
          {{ $t("S") }}: {{ props.item.SupportDate.start }}
          <br />
          {{ $t("E") }}: {{ props.item.SupportDate.end }}
        </td>
        <td v-else class="text-xs-center">{{ $t("contract in progress") }}</td>
        <td class="text-xs-center">
          <v-chip :color="critColor(props.item.critical)" :text-color="critTextColor(props.item.critical)" label>{{
            $t(props.item.critical)
          }}</v-chip>
        </td>
        <td class="text-xs-center">{{ props.item.technicalReferent }}</td>
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
import FormSoftware from "@/components/admin/contract/FormSoftware";
import ExpiredLabel from "@/components/ExpiredLabel";
import SoftwareMixin from "@/mixins/SortContractSoftware";

export default {
  name: "edit-contract-software",
  mixins: [SoftwareMixin],
  data() {
    return {
      formDialog: false,
      newSoftware: {
        software: {},
        critical: "standard",
        technicalReferent: "",
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
      this.contract.software = this.contract.software.filter(
        software => JSON.stringify(software) != JSON.stringify(this.selectedItem)
      );
      this.doRequest("Deleted");
    },
    submit(software) {
      const toastMsg = this.isEdit ? "Updated" : "Added";
      if (this.isEdit) {
        const softwareIdx = this.contract.software.findIndex(
          software => JSON.stringify(software) == JSON.stringify(this.selectedItem)
        );
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
          this.formDialog = false;
          this.isEdit = false;
          this.deleteModal = false;
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
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
    softwareHeaders() {
      return [
        { text: this.$i18n.t("Software"), value: "name" },
        { text: this.$i18n.t("Version"), value: "version" },
        { text: this.$i18n.t("OS"), value: "os" },
        {
          text: this.$i18n.t("Support date"),
          value: "supportDate"
        },
        { text: this.$i18n.t("Critical"), value: "critical" },
        {
          text: this.$i18n.t("Tech. referent"),
          value: "technicalReferent"
        },
        { text: "", value: "delete" }
      ];
    },
    software() {
      return this.sortSoftware(this.contract.software).map(item => ({ ...item, name: item.software.name }));
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

<style lang="stylus" scoped></style>
