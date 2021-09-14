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
                  <v-flex xs12 sm12 md12 lg12 xl12>
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
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-autocomplete
                      :items="activeContracts"
                      :disabled="isInEdit"
                      :label="$i18n.t('Contract')"
                      prepend-icon="note"
                      background-color="white"
                      v-model="ticket.contract"
                      item-text="name"
                      :rules="[() => Object.keys(ticket.contract).length > 0 || $i18n.t('Required field')]"
                      class="required-element"
                      return-object
                    >
                      <template v-slot:item="{ item }">
                        <span>{{ item.name }}</span>
                        <v-spacer></v-spacer>
                        <span class="grey--text caption">{{ item.client }}</span>
                      </template>
                      <template slot="selection" slot-scope="{ item }">
                        <v-chip color="blue lighten-4" class="ml-0" label small>
                          {{ item.client }}
                        </v-chip>
                        {{ item.name }}
                      </template>
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs6 md6 lg6 xl4 sm2>
                    <v-autocomplete
                      :disabled="isInEdit"
                      v-if="isInEdit"
                      :items="allUsers"
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
                  <v-flex xs12 sm12 md12 v-if="!userPhone">
                    <span class="caption ml-4">
                      {{ $t("You must fill a call number in order to let the support join you") }}
                    </span>
                  </v-flex>
                  <v-flex xs6 sm6 md6 lg6 xl6>
                    <v-text-field
                      v-if="!userPhone"
                      prepend-icon="phone"
                      v-model="callNumber"
                      :label="$i18n.t('Call number')"
                      type="tel"
                      :rules="[() => (callNumber && callNumber.length > 0) || $i18n.t('Required field')]"
                      class="required-element"
                      :hint="$t('For example, +33.1.84.88.01010')"
                      persistent-hint
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md6 lg6 xl6>
                    <v-text-field
                      v-if="!userPhone"
                      prepend-icon="meeting_room"
                      v-model="meetingId"
                      :label="$i18n.t('Meeting ID')"
                      type="text"
                      mask="###########"
                      :rules="[() => (meetingId && meetingId.length > 0) || $i18n.t('Required field')]"
                      class="required-element"
                      :hint="$t('For example, 0123456')"
                      persistent-hint
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12 xl12>
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
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-container grid-list-md>
                      <v-layout row wrap>
                        <v-flex xs12 md3 sm12 lg0 xl3>
                          <v-select
                            prepend-icon="storage"
                            :disabled="!ticket.contract._id"
                            :items="typeList"
                            v-model="ticket.type"
                            :label="$i18n.t('Type')"
                            :no-data-text="$i18n.t('No data available')"
                            :rules="[() => !!ticket.type.length || $i18n.t('Required field')]"
                            class="required-element"
                            @change="typeChanged"
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
                        <v-flex xs12 md3 sm12 lg3 xl3>
                          <v-autocomplete
                            :disabled="!ticket.type.length"
                            :label="$i18n.t('Software')"
                            prepend-icon="laptop"
                            background-color="white"
                            :items="sortedListOfSoftware"
                            v-model="ticket.software"
                            :filter="searchSoftware"
                            :rules="[isSoftwareValid || isAnomalyTicket || $i18n.t('Required field')]"
                            :class="{ 'required-element': isAnomalyTicket }"
                            @change="softwareChanged"
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
                        <v-flex xs12 md3 sm12 lg3 xl3>
                          <v-select
                            prepend-icon="report"
                            :items="severityList"
                            :disabled="!ticket.type"
                            v-model="ticket.severity"
                            :label="$i18n.t('Severity')"
                            :rules="[isSeverityValid || isAnomalyTicket || $i18n.t('Required field')]"
                            :class="{ 'required-element': isAnomalyTicket }"
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
                    v-if="selectedEngagement && Object.keys(selectedEngagement).length"
                  >
                    <span>
                      <v-icon>mdi-file-document-edit-outline</v-icon>
                      {{
                        $t(
                          "Ticket contractual engagements: " +
                            "Supported in {supported}, bypass in {bypassed}, and resolution in {resolved}",
                          {
                            supported: cnsDurationDisplay(selectedEngagement.supported),
                            bypassed: cnsDurationDisplay(selectedEngagement.bypassed),
                            resolved: cnsDurationDisplay(selectedEngagement.resolved)
                          }
                        )
                      }}
                    </span>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-input
                      prepend-icon="notes"
                      :rules="[() => ticket.description.length > 0 || $i18n.t('Required field')]"
                      class="description-input"
                    >
                      <vue-editor
                        placeholder="Description"
                        v-model="ticket.description"
                        :editorToolbar="editorToolbar"
                        class="required-element"
                      ></vue-editor>
                    </v-input>
                  </v-flex>
                  <related-requests
                    :requests="requests"
                    :linked="ticket.relatedRequests"
                    @relatedRequest:add="handleAddRelatedRequest"
                    @relatedRequest:remove="handleRemoveRelatedRequest"
                  ></related-requests>
                  <v-container>
                    <v-flex xs12>
                      <attachments v-bind:attachments.sync="attachments" :disabled="isInEdit || submitRequest" />
                    </v-flex>
                  </v-container>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-layout row wrap>
                  <v-flex xs12>
                    <div v-if="ticket.contract.credits <= contractTicketsCount + 1" class="text-xs-center">
                      {{
                        $i18n.t(
                          // eslint-disable-next-line max-len
                          "Warning : Your contract has only {credits} credits and you already consumed {consumed} credits",
                          {
                            credits: ticket.contract.credits,
                            consumed: contractTicketsCount
                          }
                        )
                      }}
                    </div>
                    <div
                      v-if="contractIsExpired"
                      class="text-xs-center warning-expired"
                      v-html="
                        $t('Warning : The contract {contractName} has expired', {
                          contractName: ticket.contract.name
                        })
                      "
                    ></div>
                  </v-flex>
                  <v-flex xs12>
                    <v-btn
                      :disabled="requiredUnfilled || submitRequest"
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
import { humanizeHoursDurationFilter } from "@/filters/humanizeHoursDurationFilter";
import { USER_TYPE } from "@/constants.js";
import { getEngagementHours } from "@/services/helpers/ticket";
import { convertIsoDurationInDaysHoursMinutes } from "@/services/helpers/duration";
import { REQUEST_TYPE } from "@/constants";
import SoftwareMixin from "@/mixins/SortContractSoftware";
import { cloneDeep, debounce } from "lodash";
import relatedRequests from "@/components/request/RelatedRequests";
import { getUserAvatarUrl } from "@/services/helpers/user";

export default {
  mixins: [SoftwareMixin],
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
      contractTicketsCount: 0,
      attachments: [],
      participants: [],
      submitRequest: false,
      selectedTypes: [],
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      emailVerfication: [],
      meetingId: "",
      callNumber: "",
      ticketsContract: []
    };
  },
  components: {
    VueEditor,
    Attachments,
    relatedRequests
  },
  methods: {
    submit() {
      if (!this.$route.params.id) {
        this.ticket.author = this.currentUser; // TODO: handle the ticket author in the backend.
      }
      this.submitRequest = true;
      this.ticket.participants = this.participants;
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
          author: this.currentUser,
          attachments: attachments.map(attachment => ({
            _id: attachment._id,
            name: attachment.name,
            mimeType: attachment.type
          }))
        };

        this.ticket.events = [event];
      }

      if (this.ticket.hasOwnProperty("software") && !this.ticket.software) {
        delete this.ticket.software;
      }

      if (this.ticket.hasOwnProperty("severity") && !this.ticket.severity) {
        delete this.ticket.severity;
      }

      if (this.callNumber && this.callNumber.length) {
        this.ticket.callNumber = this.callNumber;
      }

      if (this.meetingId && this.meetingId.length) {
        this.ticket.meetingId = this.meetingId;
      }

      if (this.ticket.software && this.ticket.software.technicalReferent) {
        delete this.ticket.software.technicalReferent;
      }

      const ticket = Object.assign({}, this.ticket);

      ticket.contract = ticket.contract._id;
      if (ticket.responsible && ticket.responsible._id) {
        ticket.responsible = this.normalizeResponsible(this.ticket.responsible);
      }

      if (this.$route.params.id) {
        // TODO: Prevent to send event when nothing has been added
        this.$store
          .dispatch("ticket/updateTicket", {
            ticketId: ticket._id,
            ticket
          })
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
        this.$store
          .dispatch("ticket/createTicket", ticket)
          .then(createdTicket => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("ticket created"),
              color: "success"
            });

            this.$router.push({ name: routeNames.REQUEST, params: { id: createdTicket._id } });
          })
          .catch(() => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("Failed to create ticket"),
              color: "error"
            });
          })
          .finally(() => {
            this.$store.dispatch("ticket/deleteDraft");
            this.submitRequest = false;
          });
      }
    },
    remove(item) {
      this.participants.splice(this.participants.indexOf(item), 1);
      this.participants = [...this.participants];
    },
    isValidEmail(email) {
      return this.reg.test(email);
    },

    isSoftwareValid() {
      if (this.ticket.type) {
        return Object.keys(this.ticket.software || {}).length > 0;
      }

      return true;
    },

    isSeverityValid() {
      if (this.ticket.type && this.ticket.software && Object.keys(this.ticket.software).length) {
        return !!this.ticket.severity;
      }

      return true;
    },

    cnsDurationDisplay(engagement) {
      const engagementHours = getEngagementHours(engagement, this.getBusinessHour);
      const { days, hours } = convertIsoDurationInDaysHoursMinutes(engagementHours.hours);

      return humanizeHoursDurationFilter({ days, hours }, engagementHours.businessHours);
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
    },
    isExpired(expirationDate) {
      const diff = this.moment().diff(expirationDate);

      return Math.sign(diff) === 1;
    },

    softwareChanged() {
      this.$set(this.ticket, "severity", null);
    },

    typeChanged() {
      this.$set(this.ticket, "software", null);
      this.$set(this.ticket, "severity", null);
    },

    handleAddRelatedRequest(related) {
      this.$set(this.ticket, "relatedRequests", [...this.ticket.relatedRequests, related]);
    },

    handleRemoveRelatedRequest(relatedId) {
      const newRelated = this.ticket.relatedRequests.filter(item => item.request._id !== relatedId);

      this.$set(this.ticket, "relatedRequests", newRelated);
    },
    initNewTicketAutoSave() {
      this.$store.dispatch("ticket/fetchDraft").then(draftTicket => {
        if (draftTicket) {
          Object.keys(draftTicket).forEach(key => {
            this.$set(this.ticket, key, draftTicket[key]);
          });
        }
      });
      this.$watch("ticket.title", debounce(this.updateDaftAutoSave, 500));
      this.$watch("ticket.description", debounce(this.updateDaftAutoSave, 500));
    },
    updateDaftAutoSave() {
      const draftTicket = {
        description: this.ticket.description,
        title: this.ticket.title
      };

      this.$store.dispatch("ticket/saveDraft", { ticket: draftTicket });
    }
  },
  computed: {
    ...mapGetters({
      currentUser: "currentUser/getUser",
      requests: "ticket/getTickets",
      displayName: "currentUser/getDisplayName",
      userPhone: "currentUser/getPhone",
      activeContracts: "contract/activeContracts",
      allUsers: "users/getUsersAsTicketUsers"
    }),

    avatarUrl() {
      return getUserAvatarUrl(this.getUser.id);
    },

    isInEdit() {
      return this.$route.params.id && true;
    },

    editorToolbar() {
      return editorToolbar;
    },

    routeNames() {
      return routeNames;
    },

    getBusinessHour() {
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

      return true;
    },

    typeList() {
      var engagements = [];
      if (this.ticket.contract && this.ticket.contract && this.ticket.contract._id) {
        engagements.push(...(this.ticket.contract.Engagements.critical.engagements || []));
        engagements.push(...(this.ticket.contract.Engagements.sensible.engagements || []));
        engagements.push(...(this.ticket.contract.Engagements.standard.engagements || []));
        return engagements.map(engagement => engagement.request);
      }

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
      if (this.ticket.type.length && this.ticket.software && this.ticket.software.software) {
        const engagements = this.ticket.contract.Engagements[this.ticket.software.critical].engagements;

        return engagements.filter(engagement => engagement.request == this.ticket.type).map(item => item.severity);
      }

      return [];
    },
    engagementsCategory() {
      if (this.ticket.type.length && this.ticket.software && this.ticket.software.software) {
        return this.ticket.contract.Engagements[this.ticket.software.critical].engagements;
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

    isAnomalyTicket() {
      return this.ticket.type && this.ticket.type === REQUEST_TYPE.ANOMALY;
    },
    sortedListOfSoftware() {
      if (this.ticket.contract.software) {
        const software = this.ticket.contract.software.filter(software => !this.isExpired(software.SupportDate.end));
        return this.sortSoftware(software);
      }

      return [];
    },
    requiredUnfilled() {
      return (
        !this.ticket.contract._id ||
        !this.ticket.title.length ||
        !this.ticket.type.length ||
        !this.ticket.description.length ||
        (this.isAnomalyTicket &&
          (!(this.ticket.software && this.ticket.software.software) ||
            !(this.ticket.severity && this.ticket.severity.length)))
      );
    },
    contractIsExpired() {
      return this.moment().diff(this.ticket.contract.endDate) > 0;
    },

    responsibleList() {
      return this.$store.getters["users/getUsersByType"](USER_TYPE.EXPERT);
    }
  },
  watch: {
    "ticket.contract": function(newContract, oldContract) {
      if (newContract && newContract._id) {
        this.$store
          .dispatch("contract/fetchContractTickets", newContract._id)
          .then(() => {
            const tickets = this.$store.getters["contract/getContractTickets"](newContract._id);

            this.contractTicketsCount = tickets.length;
          })
          .catch(() => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("Failed to fetch contract tickets"),
              color: "error"
            });
          });

        if (oldContract && oldContract._id && oldContract._id !== newContract._id) {
          this.$set(this.ticket, "type", "");
          this.$set(this.ticket, "software", null);
          this.$set(this.ticket, "severity", null);
        }
      }
    },
    participants(participants) {
      this.emailVerfication = participants.map(participant => [participant, this.isValidEmail(participant)]);
    }
  },
  created() {
    if (!this.activeContracts.length) {
      this.$store.dispatch("contract/fetchContracts");
    }

    if (this.$route.params.id) {
      const { id } = this.$route.params;

      this.submitRequest = true;
      this.$store
        .dispatch("ticket/fetchTicketById", id)
        .then(() => {
          const data = this.$store.getters["ticket/getTicketById"](id);

          this.ticket = cloneDeep(data);
          this.ticket.contract = this.$store.getters["contract/getContractById"](this.ticket.contract);
          this.participants = data.participants;
          this.callNumber = data.callNumber;
          this.meetingId = data.meetingId;
        })
        .finally(() => (this.submitRequest = false));
    } else {
      this.initNewTicketAutoSave();
    }

    this.$store.dispatch("users/fetchUsers");
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

::v-deep .description-input .v-input__prepend-outer .v-input__icon--prepend i::after {
  margin-left: .1em;
  content: '*';
  color: red;
}

.warning-expired span {
  font-weight: bold;
}
</style>
