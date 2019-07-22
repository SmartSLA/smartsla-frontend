<template>
  <v-content>
    <div>
      <v-icon>create</v-icon>
      <span>{{ $t("New issue") }}</span>
    </div>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card>
              <v-card-text>
                <v-layout wrap row>
                  <v-flex xs6 md6 lg6 xl20 sm2>
                    <v-text-field
                      prepend-icon="create"
                      name="Title"
                      v-model="ticket.title"
                      :label="$i18n.t('Title')"
                      type="text"
                      :rules="[() => ticket.title.length > 0 || $i18n.t('Required field')]"
                      class="required-element"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 md4 lg12 xl6 sm9></v-flex>
                  <v-flex xs6 md6 lg6 xl4 sm2>
                    <v-autocomplete
                      :items="contractList"
                      :label="$i18n.t('Contract')"
                      prepend-icon="note"
                      background-color="white"
                      v-model="ticket.contract"
                      item-text="name"
                      :rules="[() => Object.keys(ticket.contract).length || $i18n.t('Required field')]"
                      class="required-element"
                      return-object
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs6 md4 lg12 xl6 sm9></v-flex>
                  <v-flex xs12 md12 lg12 sm12 xl12>
                    <v-text-field
                      prepend-icon="mail"
                      v-model="ticket.participants"
                      name="Mail"
                      :label="$t('Participants E-mails (separated by commas)')"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 md12 lg12 sm12 xl12>
                    <v-container grid-list-md>
                      <v-layout row wrap>
                        <v-flex xs12 md3 sm12 lg0 xl3>
                          <v-autocomplete
                            :disabled="!ticket.contract.software"
                            :items="ticket.contract.software"
                            :label="$i18n.t('Software')"
                            prepend-icon="laptop"
                            background-color="white"
                            v-model="ticket.software"
                            :search-input.sync="software"
                            class="required-element"
                            return-object
                            :rules="[() => Object.keys(ticket.software).length || $i18n.t('Required field')]"
                          >
                            <template v-slot:item="data">
                              <v-chip label v-if="data.item.critical == 'critical'" color="red">C</v-chip>
                              <v-chip
                                label
                                v-else-if="data.item.critical == 'sensible'"
                                color="orange"
                              >S</v-chip>
                              <v-chip label v-else color="grey">S</v-chip>
                              {{ data.item.name }} {{ data.item.version }} {{ data.item.os }}
                            </template>
                            <template v-slot:selection="data">
                              <v-chip label v-if="data.item.critical == 'critical'" color="red">C</v-chip>
                              <v-chip
                                label
                                v-else-if="data.item.critical == 'sensible'"
                                color="orange"
                              >S</v-chip>
                              <v-chip label v-else color="grey">S</v-chip>
                              {{ data.item.name }} {{ data.item.version }} {{ data.item.os }}
                            </template>
                          </v-autocomplete>
                        </v-flex>
                        <v-flex xs1></v-flex>
                        <v-flex xs12 md3 sm12 lg0 xl3>
                          <v-select
                            prepend-icon="storage"
                            :disabled="!ticket.software.critical"
                            :items="[...typeList]"
                            v-model="ticket.type"
                            :label="$i18n.t('Type')"
                            :rules="[() => ticket.type.length > 0 || $i18n.t('Required field')]"
                            class="required-element"
                            return-object
                          ></v-select>
                        </v-flex>
                        <v-flex xs1></v-flex>
                        <v-flex xs12 md3 sm12 lg0 xl3>
                          <v-select
                            prepend-icon="report"
                            :items="[...severityList]"
                            :disabled="!ticket.type"
                            v-model="ticket.severity"
                            :label="$i18n.t('Severity')"
                            :rules="[() => ticket.severity.length > 0 || $i18n.t('Required field')]"
                            class="required-element"
                            return-object
                          ></v-select>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-flex>
                  <v-flex
                    class="pb-4 px-0 grey--text"
                    xs12
                    md12
                    lg12
                    sm12
                    xl12
                    v-if="Object.keys(selectedEngagement).length"
                  >
                    <span>
                      <v-icon>mdi-file-document-edit-outline</v-icon>
                      {{ $t("ticket contractual engagements") }} : {{ $t("Supported in") }}
                      {{ $t(selectedEngagement.supported) }}, {{ $t("bypass in") }}
                      {{ $t(selectedEngagement.bypassed) }}, {{ $t("and resolution in") }}
                      {{ $t(selectedEngagement.fix) }}
                    </span>
                  </v-flex>
                  <v-flex xs12 md12 lg12 sm12 xl12>
                    <v-input
                      prepend-icon="notes"
                      :rules="[() => ticket.description.length > 0 || $i18n.t('Required field')]"
                    >
                      <vue-editor
                        placeholder="Description"
                        v-model="ticket.description"
                        class="required-element"
                      ></vue-editor>
                    </v-input>
                  </v-flex>

                  <v-flex xs12 md6 sm6 lg40 xl70>
                    <v-container grid-list-md>
                      <v-layout row wrap>
                        <v-flex xs12 md5 sm12 lg6 xl4>
                          <v-select
                            prepend-icon="link"
                            class="mr-0"
                            :items="linkTypes"
                            :label="$i18n.t('linking types')"
                            v-model="linkType"
                            single-line
                            hide-details
                            solo
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 md6 sm12 lg6 xl5>
                          <v-select
                            v-model="linkedRequest"
                            :items="relatedRequests"
                            :label="$i18n.t('Related requests')"
                            solo
                            class="pt-0"
                          >
                            <template v-slot:append-outer class="custom-slot">
                              <v-btn
                                solo
                                class="ml-0 black--text mt-0 full-height"
                                @click.native="addRelated"
                              >
                                <v-icon dark>add</v-icon>
                              </v-btn>
                            </template>
                          </v-select>
                        </v-flex>
                        <v-flex xs0 md5></v-flex>
                      </v-layout>
                    </v-container>
                    <div v-for="(link, key) in linkedRequests" :key="key" class="pl-4">
                      <v-chip
                        v-model="linkedRequests[key]"
                        close
                      >{{ link.link }} : {{ link.request }}</v-chip>
                    </div>
                  </v-flex>
                  <v-flex md6 xs0></v-flex>
                  <v-flex md6 xs0></v-flex>
                  <v-flex xs10 class="pl-4">
                    <br />
                    <file-upload
                      prepend-icon="attach_file"
                      class="file"
                      url="undefined"
                      :btn-label="$i18n.t('Attach file')"
                      btn-uploading-label="Uploading file"
                    ></file-upload>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-layout>
                  <v-flex xs6 text-xs-right align-end>
                    <v-spacer></v-spacer>
                    <v-btn
                      :disabled="submitRequest"
                      :loading="submitRequest"
                      @click="validateFrom"
                      class="blue-background-color white-color"
                    >
                      {{
                      $t("Submit")
                      }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import Vue from "vue";
import FileUpload from "v-file-upload";
import { VueEditor } from "vue2-editor";
import { error } from "util";
import { COPYFILE_EXCL } from "constants";

Vue.use(FileUpload);
export default {
  data() {
    return {
      valid: true,
      ticket: {
        title: "",
        contract: {},
        participants: [],
        type: "",
        severity: "",
        description: "",
        software: {},
        relatedRequests: [],
        status: "",
        responsible: {},
        author: {},
        comments: [],
        files: []
      },
      linkedRequest: "",
      linkType: "",
      linkTypes: [
        this.$i18n.t("Linked at"),
        this.$i18n.t("Duplicated"),
        this.$i18n.t("Duplicated by"),
        this.$i18n.t("Blocked"),
        this.$i18n.t("Blocked by"),
        this.$i18n.t("Previous"),
        this.$i18n.t("Next")
      ],
      linkedRequests: [],
      submitRequest: false,
      states: ["Item 1", "Item 2", "Item 3", "Item 4"],
      scale_states: ["Item 1", "Item 2", "Item 3", "Item 4"],
      severity: "",
      software: "",
      os: "",
      type: "",
      softwareList: [],
      contractList: [],
      types: ["type1", "type2", "type3", "type4"],
      relatedRequests: [
        "#1 issue1",
        "#3 issue3",
        "#18 issue18",
        "#41 issue41",
        "#35 issue35",
        "#70 issue70"
      ],
      engagementsCategory: [],
      selectedTypes: []
    };
  },
  components: {
    VueEditor
  },
  methods: {
    submit() {
      this.submitRequest = false;
      if (!Array.isArray(this.ticket.participants)) {
        this.ticket.participants = this.ticket.participants.split(",");
      }
      this.ticket.relatedRequests = this.linkedRequests;
      this.$http
        .createTicket(this.ticket)
        .then(response => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("ticket created"),
            color: "success"
          });
          this.$router.push({
            name: "Request",
            params: { id: response.data._id }
          });
        })
        .catch(err => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: err.response.data.error.details,
            color: "error"
          });
        });
    },
    addRelated() {
      this.linkedRequests.push({
        link: this.linkType,
        request: this.linkedRequest
      });

      this.linkType = this.linkedRequest = "";
    },
    validateFrom() {
      if (this.$refs.form.validate()) {
        this.submit();
      } else {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("the required fields must be filled"),
          color: "error"
        });
      }
    }
  },
  computed: {
    typeList() {
      var engagements = [];
      var types = [];
      if (this.ticket.contract) {
        if (this.ticket.software) {
          if (this.selectedTypes.length) {
            return this.selectedTypes.map(engagement => engagement.request);
          }
          if (this.ticket.software.critical) {
            switch (this.ticket.software.critical) {
              case "critical":
                engagements = this.ticket.contract.Engagements.critical
                  .engagements;
                break;
              case "sensible":
                engagements = this.ticket.contract.Engagements.sensible
                  .engagements;

                break;
              case "standard":
                engagements = this.ticket.contract.Engagements.standard
                  .engagements;

                break;
            }

            types = engagements.map(engagement => engagement.request);
            this.selectedTypes = engagements.slice();
            return types;
          }
        }
      }
      this.selectedTypes = [];
      return [];
    },
    severityList() {
      if (this.ticket.type.length) {
        return this.selectedTypes
          .filter(engagement => engagement.request == this.ticket.type)
          .map(item => item.severity);
      }
      this.engagementsCategory = this.selectedTypes.slice();
      return [];
    },
    selectedEngagement() {
      if (this.ticket.severity.length) {
        var engagements = [];
        engagements = [...this.engagementsCategory].filter(
          engagement =>
            engagement.request == this.ticket.type &&
            engagement.severity == this.ticket.severity
        );
        return engagements[0];
      }
      return {};
    }
  },
  watch: {
    "ticket.contract": function(newContract, oldContract) {
      this.ticket.software = {};
      this.ticket.severity = {};
      this.ticket.type = {};
    },
    "ticket.software": function(newSoftware, oldSoftware) {
      this.ticket.severity = {};
      this.ticket.type = {};
    },
    "ticket.type": function(newType, oldType) {
      this.ticket.severity = {};
    }
  },
  created() {
    this.$http.getContracts().then(response => {
      this.contractList = response.data;
    });
    this.$store.dispatch("sidebar/setSidebarComponent", "new-request-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  }
};
</script>

<style lang="stylus" scoped>
.add-link {
  height: 48px;
  padding-top: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 0px;
}

.full-height {
  height: 100%;
}

.float-left {
  float: left;
  width: 50%;
  padding: 20px;
}

.float-right {
  float: right;
  width: 50%;
  padding: 20px;
}

.v-content {
  padding: 0px 0px 0px 0px !important;
}

.elevation-12 {
  -webkit-box-shadow: 0px 1px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 1px 1px rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0px 1px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 1px 1px rgba(0, 0, 0, 0.12) !important;
  widows: 100%;
}

.container.fluid.fill-height {
  margin: 0px;
  padding: 10px;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  color: #fff;
}

.file-upload .input-wrapper .file-upload-label {
  color: rgba(0, 0, 0, 0.54) !important;
}

.file-upload .input-wrapper .file-upload-label .file-upload-icon {
  float: left !important;
  font-size: 30px !important;
}

.file-upload .input-wrapper:hover {
  background-color: #eee !important;
}

.elevation-12.v-card.v-sheet.theme--light {
  height: 450px !important;
}

.v-card__actions {
  padding-top: 80px;
}

.quillWrapper, .ql-editor {
  width: 100%;
}

.container.fluid.fill-height {
  margin: 0px;
  padding: 0px !important;
}

div.container:nth-child(2) {
  padding-top: 10px !important;
}

div.container:nth-child(2) {
  padding-right: 0px !important;
}

main.v-content:nth-child(1) > div:nth-child(1) > div:nth-child(1) {
  padding-bottom: 4px;
}

main.v-content:nth-child(1) > div:nth-child(1) > div:nth-child(1) {
  display: inline-flex;
}

main.v-content:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2) {
  margin-top: 2px;
  margin-left: 2px;
}

.v-btn {
  margin: 0px !important;
}

button.ml-0 {
  min-height: 48px;
}

@media only screen and (max-width: 959px) {
  .v-input.pt-0.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--enclosed.v-select.theme--light {
    padding-left: 33px !important;
  }
}

.container.grid-list-md .layout .flex {
  padding: 0px !important;
}
</style>
