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
                      :rules="[() => Object.keys(ticket.contract).length > 0 || $i18n.t('Required field')]"
                      class="required-element"
                      return-object
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs6 md4 lg12 xl6 sm9></v-flex>
                  <v-flex xs12 md12 lg12 sm12 xl12>
                    <v-combobox
                      prepend-icon="mail"
                      v-model="participants"
                      :label="$t('Participants E-mails')"
                      multiple
                      chips
                    >
                      <template slot="selection" slot-scope="data">
                        <v-chip
                          :class="{ validMail: !emailVerfication[data.index][1] }"
                          :color="emailVerfication[data.index][1] ? 'default' : 'red'"
                          :text-color="emailVerfication[data.index][1] ? '' : 'white'"
                          :selected="data.selected"
                          close
                          @input="remove(data.item)"
                        >
                          {{ data.item }}
                        </v-chip>
                      </template>
                    </v-combobox>
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
                            :rules="[() => Object.keys(ticket.software).length > 0 || $i18n.t('Required field')]"
                          >
                            <template v-slot:item="data">
                              <v-chip label v-if="data.item.critical == 'critical'" color="red">C</v-chip>
                              <v-chip label v-else-if="data.item.critical == 'sensible'" color="orange">S</v-chip>
                              <v-chip label v-else color="grey">S</v-chip>
                              {{ data.item.name }} {{ data.item.version }} {{ data.item.os }}
                            </template>
                            <template v-slot:selection="data">
                              <v-chip label v-if="data.item.critical == 'critical'" color="red">C</v-chip>
                              <v-chip label v-else-if="data.item.critical == 'sensible'" color="orange">S</v-chip>
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
                          >
                            <template slot='selection' slot-scope='{ item }'>
                              {{ $t(item) }}
                            </template>
                            <template slot='item' slot-scope='{ item }'>
                              {{ $t(item) }}
                            </template>
                          </v-select>
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
                          >
                            <template slot='selection' slot-scope='{ item }'>
                              {{ $t(item) }}
                            </template>
                            <template slot='item' slot-scope='{ item }'>
                              {{ $t(item) }}
                            </template>
                          </v-select>
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
                      {{ $t(selectedEngagement.resolved) }}
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
                              <v-btn solo class="ml-0 black--text mt-0 full-height" @click.native="addRelated">
                                <v-icon dark>add</v-icon>
                              </v-btn>
                            </template>
                          </v-select>
                        </v-flex>
                        <v-flex xs0 md5></v-flex>
                      </v-layout>
                    </v-container>
                    <div v-for="(link, key) in linkedRequests" :key="key" class="pl-4">
                      <v-chip v-model="linkedRequests[key]" close>{{ link.link }} : {{ link.request }}</v-chip>
                    </div>
                  </v-flex>
                  <v-flex xs12 md8 sm8 xl3 lg1></v-flex>
                  <v-flex xs12 md8 sm8 xl3 lg1></v-flex>
                  <v-flex xs12 md8 sm8 xl3 lg3>
                    <v-upload :label="$i18n.t('Attach file')" v-model="ticket.requestFile"></v-upload>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-layout row wrap>
                  <v-flex>
                    <v-btn
                      :disabled="submitRequest"
                      :loading="submitRequest"
                      @click="validateFrom"
                      class="blue-background-color white-color custom-btn-action"
                    >
                      {{ $t("Submit") }}
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
import { mapGetters } from "vuex";
import Vue from "vue";
import FileUpload from "v-file-upload";
import { VueEditor } from "vue2-editor";
import VUpload from "vuetify-upload-component";
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
        status: "new",
        responsible: {},
        author: {},
        comments: [],
        requestFile: [],
        contenu: "",
        files: []
      },
      participants: [],
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
      relatedRequests: [],
      engagementsCategory: [],
      selectedTypes: [],
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      emailVerfication: []
    };
  },
  components: {
    VueEditor,
    VUpload
  },
  methods: {
    submit() {
      this.ticket.author = this.getUser;

      this.submitRequest = false;
      this.ticket.participants = this.participants;
      this.ticket.relatedRequests = this.linkedRequests;
      if (this.ticket.requestFile.length) {
        this.submitRequest = false;
        let requestFile = this.ticket.requestFile[0];
        let fileSize = requestFile.size;
        let mimeType = requestFile.type;
        let formData = new FormData();
        formData.append("file", requestFile);
        this.$http
          .uploadFile(formData, mimeType, fileSize, requestFile.name)
          .then(response => {
            this.postRequest(response.data._id, requestFile.name);

            this.submitRequest = true;
          })
          .catch(error => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: error.response.data.error.details,
              color: "error"
            });
            this.submitRequest = true;
          });
      } else {
        this.postRequest();
      }
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
    },

    postRequest(fileId = "", fileName = "") {
      if (fileId !== "") {
        let fileObject = {
          name: fileName,
          id: fileId
        };
        this.ticket.files = [];
        this.ticket.files.push(fileObject);
      }

      this.$http
        .createTicket(this.ticket)
        .then(response => {
          const ticketId = response.data;

          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("ticket created"),
            color: "success"
          });

          // TODO: Move to store once the store is used to create requests
          this.$store.dispatch("ticket/countTickets")

          this.$router.push(`/requests/${ticketId}`);
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },
    remove(item) {
      this.participants.splice(this.participants.indexOf(item), 1);
      this.participants = [...this.participants];
    },
    isValidEmail(email) {
      return this.reg.test(email);
    }
  },
  computed: {
    ...mapGetters({
      getUser: "user/getUser"
    }),
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
                engagements = this.ticket.contract.Engagements.critical.engagements;
                break;
              case "sensible":
                engagements = this.ticket.contract.Engagements.sensible.engagements;

                break;
              case "standard":
                engagements = this.ticket.contract.Engagements.standard.engagements;

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
          engagement => engagement.request == this.ticket.type && engagement.severity == this.ticket.severity
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
    },
    participants(participants) {
      this.emailVerfication = participants.map(participant => [participant, this.isValidEmail(participant)]);
    }
  },
  created() {
    this.$http.getContracts().then(response => {
      this.contractList = response.data;
    });
    this.$store.dispatch("sidebar/setSidebarComponent", "new-request-side-bar");
  },
  mounted() {
    this.$http.listTickets().then(response => {
      response.data.forEach(ticket => {
        this.relatedRequests.push(ticket._id);
      });
    });
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

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat):not(.error) {
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

.custom-btn-action {
  padding-top: 3px !important;
  margin-right: auto !important;
  margin-left: auto !important;
  display: block !important;
  width: 150px;
  height: 35px;
}

.v-card__actions {
  padding-top: 30px !important;
}
</style>
