<template>
  <v-content>
    <div>
      <v-icon>create</v-icon>
      <span>{{ isInEdit ? $t("Edit issue") : $t("New issue") }}</span>
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
                      :disabled="isInEdit"
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
                  <v-flex xs6 md6 lg6 xl4 sm2>
                    <v-autocomplete
                      v-if="isInEdit"
                      :items="beneficiaryList"
                      :label="$i18n.t('Beneficiary')"
                      prepend-icon="people"
                      background-color="white"
                      v-model="ticket.beneficiary"
                      item-text="name"
                      :rules="[() => Object.keys(ticket.beneficiary).length > 0 || $i18n.t('Required field')]"
                      class="required-element"
                      return-object
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs6 md4 lg12 xl6 sm9></v-flex>
                  <v-flex xs12 v-if="!userPhone">
                    <span class="ml-4">
                      {{ $t("You must fill a call number in order to let the support join you") }}
                    </span>
                  </v-flex>
                  <v-flex xs6 md4 lg12 xl6 sm9>
                    <v-text-field
                      v-if="!userPhone"
                      prepend-icon="phone"
                      v-model="callNumber"
                      :label="$i18n.t('Call number')"
                      type="tel"
                      :rules="[() => callNumber.length > 0 || $i18n.t('Required field')]"
                      class="required-element"
                      :hint="$t('For example, +33.1.84.88.01010')"
                      persistent-hint
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 md4 lg12 xl6 sm9>
                    <v-text-field
                      v-if="!userPhone"
                      prepend-icon="meeting_room"
                      v-model="meetingId"
                      :label="$i18n.t('Meeting ID')"
                      type="text"
                      mask="###########"
                      :rules="[() => meetingId.length > 0 || $i18n.t('Required field')]"
                      class="required-element"
                      :hint="$t('For example, 0123456')"
                      persistent-hint
                    ></v-text-field>
                  </v-flex>
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
                          <v-select
                            prepend-icon="storage"
                            :disabled="!ticket.contract._id"
                            :items="[...typeList]"
                            v-model="ticket.type"
                            :label="$i18n.t('Type')"
                            :no-data-text="$i18n.t('No data available')"
                            :rules="[() => ticket.type.length > 0 || $i18n.t('Required field')]"
                            class="required-element"
                            return-object
                          >
                            <template slot="selection" slot-scope="{ item }">
                              {{ $t(item) }}
                            </template>
                            <template slot="item" slot-scope="{ item }">
                              {{ $t(item) }}
                            </template>
                          </v-select>
                        </v-flex>
                        <v-flex xs1></v-flex>
                        <v-flex xs12 md3 sm12 lg0 xl3>
                          <v-autocomplete
                            :disabled="!ticket.type.length"
                            :label="$i18n.t('Software')"
                            prepend-icon="laptop"
                            background-color="white"
                            :items="[...sortedListOfSoftware]"
                            v-model="ticket.software"
                            :filter="searchSoftware"
                            :rules="[validateSoftware() || $i18n.t('Required field')]"
                            :class="{ 'required-element': !isInformationRequest }"
                            return-object
                          >
                            <template v-slot:item="data">
                              <v-chip label v-if="data.item.critical == 'critical'" color="red">C</v-chip>
                              <v-chip label v-else-if="data.item.critical == 'sensible'" color="orange">S</v-chip>
                              <v-chip label v-else color="grey">S</v-chip>
                              {{ data.item.software && data.item.software.name }} {{ data.item.version }}
                              {{ data.item.os }}
                            </template>
                            <template v-slot:selection="data">
                              <v-chip label v-if="data.item.critical == 'critical'" color="red">C</v-chip>
                              <v-chip label v-else-if="data.item.critical == 'sensible'" color="orange">S</v-chip>
                              <v-chip label v-else color="grey">S</v-chip>
                              {{ data.item.software && data.item.software.name }} {{ data.item.version }}
                              {{ data.item.os }}
                            </template>
                          </v-autocomplete>
                        </v-flex>
                        <v-flex xs1></v-flex>
                        <v-flex xs12 md3 sm12 lg0 xl3>
                          <v-select
                            prepend-icon="report"
                            :items="[...severityList]"
                            :disabled="!ticket.type"
                            v-model="ticket.severity"
                            :label="$i18n.t('Severity')"
                            :rules="[validateSeverity() || $i18n.t('Required field')]"
                            :class="{ 'required-element': !isInformationRequest || this.ticket.software }"
                            return-object
                          >
                            <template slot="selection" slot-scope="{ item }">
                              {{ $t(item) }}
                            </template>
                            <template slot="item" slot-scope="{ item }">
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
                      {{
                        $t(
                          "Ticket contractual engagements: " +
                            "Supported in {supported}, bypass in {bypassed}, and resolution in {resolved}",
                          {
                            supported: cnsDurationDisplay(selectedEngagement.supported, createdDuringBusinessHours),
                            bypassed: cnsDurationDisplay(selectedEngagement.bypassed, createdDuringBusinessHours),
                            resolved: cnsDurationDisplay(selectedEngagement.resolved, createdDuringBusinessHours)
                          }
                        )
                      }}
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
                        :editorToolbar="editorToolbar"
                        class="required-element"
                      ></vue-editor>
                    </v-input>
                  </v-flex>
                  <v-flex>
                    <v-layout column class="link-type">
                      <v-flex xs6 md6 mb-2>
                        <v-select
                          prepend-icon="link"
                          :items="linkTypes"
                          :label="$i18n.t('Link type')"
                          v-model="linkType"
                          single-line
                          hide-details
                          flat
                          solo
                          background-color="grey lighten-5"
                        ></v-select>
                      </v-flex>
                      <v-flex xs6 md6 mb-2>
                        <v-autocomplete
                          :items="filtredRelated"
                          :filter="searchRequest"
                          :label="$i18n.t('Related requests')"
                          hide-details
                          hide-selected
                          return-object
                          v-model="linkedRequest"
                          background-color="grey lighten-5"
                          flat
                          solo
                        >
                          <template v-slot:selection="data">
                            {{ `#${data.item.id} - ${data.item.title}` }}
                          </template>
                          <template v-slot:item="data">
                            {{ `#${data.item.id} - ${data.item.title}` }}
                          </template>
                          <template v-slot:append-outer>
                            <v-btn
                              :disabled="!(linkType && linkedRequest)"
                              class="black--text"
                              @click.native="addRelated"
                              icon
                              background-color="grey lighten-5"
                            >
                              <v-icon>mdi-plus-circle</v-icon>
                            </v-btn>
                          </template>
                        </v-autocomplete>
                      </v-flex>
                    </v-layout>
                    <v-layout column class="d-inline-flex ml-4 link-type">
                      <div v-for="(link, key) in linkedRequests" :key="key">
                        <v-chip close @input="resetRelatedRequest(link.request.id)">
                          <v-avatar>
                            <router-link
                              :to="{ name: routeNames.REQUEST, params: { id: link.request.id } }"
                              target="_blank"
                            >
                              <v-icon small>open_in_new</v-icon>
                            </router-link>
                          </v-avatar>
                          {{ `${link.link} : #${link.request.id} - ${link.request.title}` }}
                        </v-chip>
                      </div>
                    </v-layout>
                  </v-flex>
                  <v-container>
                    <v-flex xs12>
                      <attachments v-bind:attachments.sync="attachments" :disabled="submitRequest" />
                    </v-flex>
                  </v-container>
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
import { routeNames } from "@/router";
import momentBusiness from "moment-business";
import editorToolbar from "@/services/helpers/default-toolbar";
import { VueEditor } from "vue2-editor";
import Attachments from "@/components/attachments/creation/Attachments.vue";
import { USER_TYPE } from "@/constants.js";

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
        author: {},
        beneficiary: {},
        Responsible: {}
      },
      attachments: [],
      participants: [],
      linkedRequest: null,
      linkType: null,
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
      beneficiaryList: [],
      responsibleList: [],
      contractList: [],
      engagementsCategory: [],
      selectedTypes: [],
      // eslint-disable-next-line max-len,no-useless-escape
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      emailVerfication: [],
      meetingId: "",
      callNumber: ""
    };
  },
  components: {
    VueEditor,
    Attachments
  },
  methods: {
    submit() {
      if (!this.$route.params.id) {
        this.ticket.author = this.getUser; // TODO: handle the ticket author in the backend.
      }
      this.submitRequest = true;
      this.ticket.participants = this.participants;
      this.ticket.relatedRequests = this.linkedRequests;
      if (this.attachments.length) {
        this.$http
          .getUploader()
          .uploadAll(this.attachments)
          .then(attachments => this.postRequest(attachments))
          .catch(() => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("Failed to upload attachments"),
              color: "error"
            });
          })
          .finally(() => (this.submitRequest = true));
      } else {
        this.postRequest();
      }
    },

    addRelated() {
      this.linkedRequests.push({
        link: this.linkType,
        request: this.linkedRequest
      });

      this.linkType = this.linkedRequest = null;
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

    postRequest(attachments = []) {
      if (attachments.length) {
        const event = {
          author: {
            id: this.$store.state.user.user._id,
            name: this.displayName,
            image: this.avatarUrl
          },
          attachments: attachments.map(attachment => ({
            _id: attachment._id,
            name: attachment.name,
            mimeType: attachment.type
          }))
        };

        this.ticket.events = [event];
      }

      if (this.ticket.hasOwnProperty("software") && !this.ticket.software.software) {
        delete this.ticket.software;
      }

      if (this.ticket.hasOwnProperty("severity") && !this.ticket.severity.length) {
        delete this.ticket.severity;
      }

      if (this.callNumber && this.callNumber.length) {
        this.ticket.callNumber = this.callNumber;
      }

      if (this.meetingId && this.meetingId.length) {
        this.ticket.meetingId = this.meetingId;
      }

      const ticket = Object.assign({}, this.ticket);

      ticket.contract = ticket.contract._id;
      if (ticket.responsible && ticket.responsible._id) {
        ticket.responsible = this.normalizeResponsible(this.ticket.responsible);
      }

      if (this.$route.params.id) {
        // TODO: Prevent to send event when nothing has been added
        this.$http
          .updateTicket(this.$route.params.id, ticket)
          .then(() => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("Ticket updated"),
              color: "success"
            });

            this.$router.push({ name: routeNames.REQUEST, params: { id: ticket._id } });
          })
          .catch(() => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("Failed to update ticket"),
              color: "error"
            });
          })
          .finally(() => (this.submitRequest = false));
      } else {
        this.$http
          .createTicket(ticket)
          .then(response => {
            const ticketId = response.data;

            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("ticket created"),
              color: "success"
            });

            // TODO: Move to store once the store is used to create requests
            this.$store.dispatch("ticket/countTickets");

            this.$router.push({ name: routeNames.REQUEST, params: { id: ticketId } });
          })
          .catch(() => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("Failed to create ticket"),
              color: "error"
            });
          })
          .finally(() => (this.submitRequest = false));
      }
    },
    remove(item) {
      this.participants.splice(this.participants.indexOf(item), 1);
      this.participants = [...this.participants];
    },
    isValidEmail(email) {
      return this.reg.test(email);
    },

    validateSoftware() {
      if (this.ticket.type.length) {
        if (this.ticket.type.toLowerCase() === "information") {
          return true;
        }
        return Object.keys(this.ticket.software || {}).length > 0;
      }

      return true;
    },

    validateSeverity() {
      if (this.ticket.type.length && this.ticket.software) {
        return this.ticket.severity.length > 0;
      }

      return true;
    },

    resetRelatedRequest(relatedRequestID) {
      this.linkedRequests = this.linkedRequests.filter(item => item.request.id !== relatedRequestID);
    },
    searchRequest(item, queryText) {
      const textOne = item.title.toLowerCase();
      const textTwo = item.id.toLowerCase();
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1;
    },

    cnsDurationDisplay(cnsType, isInBusinessHours) {
      const durationString = isInBusinessHours ? cnsType.businessHours : cnsType.nonBusinessHours;
      const parsedDuration = this.moment.duration(durationString);
      const days = parsedDuration
        .clone()
        .subtract({
          hours: parsedDuration.hours()
        })
        .asDays();

      if (days) {
        if (parsedDuration.hours()) {
          return this.$i18n.t(isInBusinessHours ? "{days}wd {hours}wh" : "{days}d {hours}h", {
            days,
            hours: parsedDuration.hours()
          });
        }

        return this.$i18n.t(isInBusinessHours ? "{days}wd" : "{days}d", {
          days
        });
      }

      return this.$i18n.t(isInBusinessHours ? "{hours}wh" : "{hours}h", {
        hours: parsedDuration.hours()
      });
    },
    searchSoftware(item, queryText) {
      const searchText = queryText.toLowerCase();
      const proposedSoftware = `${item.software.name} ${item.version} ${item.os}`;

      return proposedSoftware.toLowerCase().indexOf(searchText) > -1;
    },

    normalizeResponsible(responsible) {
      const newResponsible = responsible;

      delete newResponsible.user;
      delete newResponsible.timestamps;
      return newResponsible;
    }
  },
  computed: {
    ...mapGetters({
      getUser: "user/getUser",
      requests: "ticket/getTickets",
      displayName: "user/getDisplayName",
      avatarUrl: "user/getAvatarUrl",
      userPhone: "user/getPhone"
    }),

    isInEdit() {
      return this.$route.params.id && true;
    },

    editorToolbar() {
      return editorToolbar;
    },

    relatedRequests() {
      return (this.requests || []).map(ticket => ({ id: `${ticket._id}`, title: ticket.title }));
    },

    routeNames() {
      return routeNames;
    },

    createdDuringBusinessHours() {
      const currentDate = this.moment();

      if (this.ticket._id && this.ticket.createdDuringBusinessHours) {
        return true;
      }

      if (this.ticket.contract && this.ticket.contract.features && this.ticket.contract.features.nonBusinessHours) {
        if (momentBusiness.isWeekendDay(currentDate)) {
          return false;
        }

        if (
          this.ticket.contract.businessHours &&
          this.ticket.contract.businessHours.start &&
          this.ticket.contract.businessHours.end
        ) {
          return (
            currentDate.hours() >= this.ticket.contract.businessHours.start &&
            currentDate.hours() < this.ticket.contract.businessHours.end
          );
        }
      }

      return false;
    },

    typeList() {
      var engagements = [];
      if (this.ticket.contract && Object.keys(this.ticket.contract).length) {
        engagements.push(...(this.ticket.contract.Engagements.critical.engagements || []));
        engagements.push(...(this.ticket.contract.Engagements.sensible.engagements || []));
        engagements.push(...(this.ticket.contract.Engagements.standard.engagements || []));
        return engagements.map(engagement => engagement.request);
      }

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.selectedTypes = []; // FIXME Fix this
      return [];
    },

    softwareList() {
      let softwareList = [];
      if (this.ticket.contract && this.ticket.type.length) {
        Object.keys(this.ticket.contract.Engagements || {}).forEach(criticity => {
          if (
            (this.ticket.contract.Engagements[criticity].engagements || []).filter(
              engagement => engagement.request == this.ticket.type
            ).length
          ) {
            softwareList.push(...this.ticket.contract.software.filter(software => software.critical === criticity));
          }
        });

        return softwareList;
      }

      return [];
    },

    severityList() {
      if (this.ticket.type.length && Object.keys(this.ticket.software || {}).length) {
        const engagements = this.ticket.contract.Engagements[this.ticket.software.critical].engagements;
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.engagementsCategory = engagements.slice(); // FIXME Fix this
        return engagements.filter(engagement => engagement.request == this.ticket.type).map(item => item.severity);
      }

      return [];
    },
    selectedEngagement() {
      if (this.ticket.severity && this.ticket.severity.length && this.engagementsCategory.length) {
        var engagements = [];
        engagements = [...this.engagementsCategory].filter(
          engagement => engagement.request == this.ticket.type && engagement.severity == this.ticket.severity
        );
        return engagements[0];
      }
      return {};
    },
    filtredRelated: function() {
      let filtredList = this.relatedRequests;
      const store = [];
      this.linkedRequests.forEach(storedItem => {
        store.push(storedItem.request);
      });

      filtredList = filtredList.filter(item => !store.includes(item));

      return filtredList;
    },

    isInformationRequest() {
      return this.ticket.type && this.ticket.type.toLowerCase() === "information";
    },
    sortedListOfSoftware() {
      if (this.ticket.contract.software) {
        // FIXME Fix this
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        return this.ticket.contract.software.sort((a, b) => a.software.name.localeCompare(b.software.name));
      }

      return [];
    }
  },
  watch: {
    "ticket.contract": function(newContract, oldContract) {
      if (Object.keys(oldContract).length !== 0) {
        this.ticket.type = "";
        this.ticket.software = {};
        this.ticket.severity = "";
      }
    },
    "ticket.type": function(newType, oldType) {
      if (oldType.length !== 0) {
        this.ticket.software = {};
        this.ticket.severity = "";
      }
    },
    "ticket.software": function(newSoftware, oldSoftware) {
      if (Object.keys(oldSoftware).length !== 0) {
        this.ticket.severity = "";
      }
    },
    participants(participants) {
      this.emailVerfication = participants.map(participant => [participant, this.isValidEmail(participant)]);
    }
  },
  created() {
    this.$http.getContracts().then(({ data }) => {
      this.contractList = data;
    });

    if (this.$route.params.id) {
      this.$http.getTicketById(this.$route.params.id).then(({ data }) => {
        this.ticket = Object.assign({}, data);
        this.linkedRequests = data.relatedRequests;
        this.participants = data.participants;
        this.callNumber = data.callNumber;
        this.meetingId = data.meetingId;
      });
    }

    this.$http.listUsers().then(({ data }) => {
      this.beneficiaryList = data;
      this.responsibleList = data.filter(user => user.type === USER_TYPE.EXPERT);
    });
  },
  mounted() {
    this.$store.dispatch("ticket/fetchTickets");
  }
};
</script>

<style>
.v-text-field.v-text-field--solo .v-input__append-outer {
  padding: 6px 0 0 0 !important;
}
</style>

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
  -webkit-box-shadow: 0px 1px 1px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 1px rgba(0, 0, 0, 0.14),
      0px 1px 1px 1px rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0px 1px 1px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 1px rgba(0, 0, 0, 0.14),
      0px 1px 1px 1px rgba(0, 0, 0, 0.12) !important;
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

@media only screen and (max-width: 768px) {
  .link-type .flex:nth-child(2) {
    margin:0 0 0 31px;
  }
}

@media only screen and (min-width: 1263px) {
  .link-type {
    flex-direction: row !important;
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
