<template>
  <v-container grid-list-md>
    <v-layout align-center justify-space-between row>
      <div>
        <router-link :to="{ name: 'Requests' }">
          <button><v-icon>arrow_back</v-icon></button>
        </router-link>
      </div>
      <div>
        <v-btn flat small color="default">
          <v-icon class="mr-2">backup</v-icon> {{ $t("Export sheet (CSV)") }}
        </v-btn>
      </div>
    </v-layout>
    <v-layout row wrap justify-space-between>
      <v-flex xs12 md12 sm12 xl8 lg8 pl-3 pr-3 pt-4>
        <v-card light color="white">
          <v-layout row wrap>
            <v-flex xs2 md1 sm1 lg1 xl1 class="mt-4">
              <strong class="pt-4 pl-4">{{ $t("Status") }}:</strong>
            </v-flex>
            <v-flex xs10 md11 sm11 xl11 lg11>
              <v-stepper class="noshadow" non-linear>
                <v-stepper-header>
                  <v-stepper-step step="1" color="success" complete>{{ $t("New") }}</v-stepper-step>
                  <v-divider v-if="ticketStatusId < 1"></v-divider>
                  <v-divider v-else color="success"></v-divider>

                  <v-stepper-step
                    v-if="ticketStatusId < 1"
                    step
                    complete
                    color="primary"
                    complete-icon="access_time"
                    class="current_step"
                    >{{ $t("Supported") }}</v-stepper-step
                  >
                  <v-stepper-step v-else step complete color="success">{{ $t("Supported") }}</v-stepper-step>

                  <v-divider v-if="ticketStatusId < 2"></v-divider>
                  <v-divider v-else color="success"></v-divider>
                  <v-stepper-step
                    v-if="ticketStatusId == 1"
                    step
                    complete
                    color="primary"
                    complete-icon="access_time"
                    class="current_step"
                    >{{ $t("Bypassed") }}</v-stepper-step
                  >
                  <v-stepper-step v-else-if="ticketStatusId < 2" step>{{ $t("Bypassed") }}</v-stepper-step>
                  <v-stepper-step v-else step complete color="success">{{ $t("Bypassed") }}</v-stepper-step>
                  <v-divider v-if="ticketStatusId < 3"></v-divider>
                  <v-divider v-else color="success"></v-divider>
                  <v-stepper-step
                    v-if="ticketStatusId == 2"
                    step
                    complete
                    color="primary"
                    complete-icon="access_time"
                    class="current_step"
                    >{{ $t("Resolved") }}</v-stepper-step
                  >
                  <v-stepper-step v-else-if="ticketStatusId < 3" step>{{ $t("Resolved") }}</v-stepper-step>
                  <v-stepper-step v-else step complete color="success">{{ $t("Resolved") }}</v-stepper-step>
                  <v-divider v-if="ticketStatusId < 4"></v-divider>
                  <v-divider v-else color="success"></v-divider>
                  <v-stepper-step
                    v-if="ticketStatusId == 3"
                    step
                    complete
                    color="primary"
                    complete-icon="access_time"
                    class="current_step"
                    >{{ $t("Closed") }}</v-stepper-step
                  >
                  <v-stepper-step v-else-if="ticketStatusId < 4" step>{{ $t("Closed") }}</v-stepper-step>
                  <v-stepper-step v-else step complete color="success">{{ $t("Closed") }}</v-stepper-step>
                </v-stepper-header>
              </v-stepper>
            </v-flex>
          </v-layout>
          <v-divider />
          <v-layout wrap>
            <v-flex xs11 md11 sm11 lg11 xl11 class="pt-0 pb-0">
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">#{{ request._id }} - {{ request.title }}</h3>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs1 md1 sm1 xl1 lg1 class="pt-0 pb-0">
              <div class="text-xs-right grey--text pt-3 justify-end">
                <v-btn color="primary" fab small disabled>
                  <v-icon>edit</v-icon>
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
          <v-divider class="pb-2" />
          <v-layout justify-center row fill-height wrap ml-3 class="custom-ticket-bl">
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Type") }} :</strong>
              {{ $t(request.type) }}
            </v-flex>

            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Severity") }} :</strong>
              {{ $t(request.severity) }}
            </v-flex>
            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Created at") }} :</strong>
              {{ request.ticketDate | formatDateFilter('llll') }}
            </v-flex>
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{
                $t("Created by : {authorName}", { authorName: request.author && request.author.name })
              }}</strong>
            </v-flex>

            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Assigned to") }} :</strong>
              <v-chip
                v-if="request.assignedTo && request.assignedTo.type == 'beneficiary'"
                color="#174dc5"
                class="my-0"
                label
                small
                text-color="white"
              >{{ request.contract.client[0] }}</v-chip>
              <span v-else>
                <span v-if="request.assignedTo">
                  <v-chip
                    small
                    class="my-0"
                    color="#d32f2f"
                    label
                    text-color="white"
                  >L</v-chip>
                </span>
              </span>
              {{ (request.assignedTo && request.assignedTo.name) || $t("Not assigned yet") }}
            </v-flex>

            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Last update") }} :</strong>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on"> {{ request.lastUpdate | relativeTime }}</span>
                </template>
                <span> {{ request.lastUpdate | formatDateFilter('llll')  }}</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Software") }} :</strong>
              {{ request.software && request.software.software.name }}
            </v-flex>
            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Version") }} :</strong>
              {{ request.software && request.software.version }}
            </v-flex>
            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("OS") }} :</strong>
              {{ request.software && request.software.os }}
            </v-flex>
          </v-layout>
          <v-divider class="mt-2"></v-divider>
          <v-card>
            <v-card-text>
              <v-subheader inset class="ml-0">
                <v-icon>subject</v-icon>
                {{ $t("Description") }}
              </v-subheader>
              <div class="subject-text ml-3" v-html="request.description"></div>
            </v-card-text>
            <v-card-text v-if="ticket.participants && ticket.participants.length">
              <v-subheader inset class="ml-0">
                <v-icon>email</v-icon>
                {{ $t("Participants E-mails") }}
              </v-subheader>
              <v-layout>
                <v-flex xs12 class="pt-0 pl-0">
                  <v-chip v-for="(participant, index) in ticket.participants" :key="index" class="ma-2">
                    <a :href="`mailto:${participant}`">{{ participant }}</a>
                  </v-chip>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text v-if="attachments && attachments.length">
              <v-list subheader two-line>
                <v-subheader inset class="ml-0">
                  <v-icon>attach_file</v-icon>
                  {{ $t("Attachments") }}
                </v-subheader>
                <template v-for="(attachment, index) in attachments">
                  <v-list-tile :key="attachment.id" ripple @click="downloadFile(attachment)">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ attachment.name }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-action-text>{{ attachment.timestamps.createdAt | calendarTimeFilter }}</v-list-tile-action-text>
                      <v-btn icon ripple class="ma-0" @click.stop="scrollToEvent(attachment.event)">
                        <v-icon color="grey lighten-1">info</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider v-if="index < attachments.length - 1" :key="attachment.id"></v-divider>
                </template>
              </v-list>
            </v-card-text>
            <v-card-text v-if="request.linkedTickets && request.linkedTickets.length">
              <v-subheader inset class="ml-0">
                <v-icon>insert_link</v-icon>
                {{ $t("Related requests") }}
              </v-subheader>
              <v-layout>
                <v-flex xs12 md11 sm8 xl10 lg10 pl-0>
                  <v-layout row wrap>
                    <v-flex xs6 md2 sm6 lg2 xl2 pl-0>
                      <strong>{{ $t("Related requests") }}:</strong>
                    </v-flex>
                    <v-flex xs10 md8 sm6 lg8 xl6 pl-0>
                      <ul v-if="request.linkedTickets">
                        <li v-for="(link, key) in request.linkedTickets" :key="key">
                          <router-link target="_blank" :to="{ name: 'Request', params: { id: link.request.id } }">
                            {{ `${link.link} : #${link.request.id} - ${link.request.title}` }}
                          </router-link>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-card>
            <v-tabs grow icons-and-text class="ml-3 mr-3">
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab href="#comment">{{ $t("Comments") }}</v-tab>
              <v-tab disabled href="#satisfaction">{{ $t("satisfaction after closure") }}</v-tab>
              <v-tab-item value="comment" class="mt-1">
                <v-timeline dense clipped>
                  <v-timeline-item v-for="event in events" :key="event._id" large :ref="`event-${event._id}`">
                    <template v-slot:icon>
                      <v-avatar>
                        <v-img :src="event.author.image"></v-img>
                        <!-- TODO else generate avatar from OP API -->
                      </v-avatar>
                    </template>
                    <v-card
                      flat
                      class="elevation-2"
                      :color="event.author.type === 'expert' ? 'blue lighten-5' : 'grey lighten-4'"
                    >
                      <v-card-title primary-title class="pt-3">
                        <div class="flex">
                          <div class="subheading font-weight-medium">{{ event.author.name }}</div>
                          <div class="body-1">{{ event.timestamps.createdAt | calendarTimeFilter }}</div>
<!--                          <div v-if="event.isPrivateComment">-->
<!--                            <span class="red&#45;&#45;text">{{ $t("private comment") }}</span>-->
<!--                          </div>-->
                        </div>
                      </v-card-title>
                      <v-card-text v-if="event.comment" v-html="event.comment" class="pt-0" />
                      <v-card-text v-if="(event.target && event.target.name) || event.status" class="grey--text pt-0">
                        <p
                          v-if="event.target && event.target.name"
                          v-html="
                            $t('Ticket assigned to {assignedTo}', {
                              assignedTo: event.target.name
                            })
                          "
                        ></p>
                        <p
                          v-if="event.status"
                          v-html="
                            $t('Ticket passed in status {status}', {
                              status: event.status
                            })
                          "
                        ></p>
                      </v-card-text>
                      <v-card-text v-if="event.attachments && event.attachments.length > 0" class="pt-0">
                        <v-icon>attach_file</v-icon>
                        <ul>
                          <li v-for="(attachment, index) in event.attachments" :key="index">
                            <a @click="downloadFile(attachment)">
                              {{ attachment.name }}
                            </a>
                          </li>
                        </ul>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
                <v-divider></v-divider>
                <v-form class="comment-form">
                  <!-- <v-btn-toggle v-model="selectedEditor">
                    <v-btn flat value="wysiwyg">{{ $t("wysiwyg Editor") }}</v-btn>
                    <v-btn flat value="markdown">{{ $t("Markdown Editor") }}</v-btn>
                  </v-btn-toggle>-->
                  <v-input prepend-icon="subject" class="pt-2">
                    <Editor
                      ref="editor"
                      :outline="true"
                      :preview="true"
                      v-model="comment"
                      v-if="selectedEditor == 'markdown'"
                    />
                    <vue-editor v-model="comment" v-else></vue-editor>
                    <br />
                  </v-input>
                  <v-input prepend-icon="no-icon" class="pt-2">
                    <v-layout row wrap>
                      <v-flex xs12 md6>
                        <v-select
                          :items="[allowedStatusList]"
                          v-model="newStatus"
                          :disabled="privateComment"
                          :label="$t('Status')"
                        >
                          <template slot="item" slot-scope="{ item }">
                            {{$t(capitalize(item))}}
                          </template>
                          <template slot="selection" slot-scope="{ item }">
                             {{$t(capitalize(item))}}
                          </template>
                        </v-select>
                      </v-flex>
                      <v-flex xs12 md6>
                        <v-autocomplete
                          :items="allowedAssigneeList"
                          :disabled="privateComment"
                          item-text="name"
                          v-model="newResponsible"
                          :label="$t('Assigned to')"
                          return-object
                        >
                          <template slot="item" slot-scope="data">
                            <v-list-tile-avatar>
                              <v-chip
                                v-if="data.item.type === 'beneficiary'"
                                color="#174dc5"
                                class="ma-2"
                                label
                                text-color="white"
                                >{{ request.contract.client[0] }}
                              </v-chip>
                              <v-chip v-else color="#d32f2f" class="ma-2" label text-color="white">L</v-chip>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              {{ data.item.name }}
                            </v-list-tile-content>
                          </template>
                        </v-autocomplete>
                      </v-flex>
                    </v-layout>
                  </v-input>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <attachments-creation
                        v-bind:attachments.sync="commentCreationAttachments"
                        :disabled="!commentBtn"
                      />
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs1 md4 sm4 lg4 xl4></v-flex>
                    <v-flex xs2 md4 sm4 lg4 xl4>
                      <v-btn color="info" class="custom-comment-btn" @click="addEvent" :disabled="!commentBtn">{{
                        $t("Add comment")
                      }}</v-btn>
                    </v-flex>
                    <v-flex xs4 md4 sm4 lg4 xl4></v-flex>
                  </v-layout>
                </v-form>
              </v-tab-item>
              <v-tab-item value="satisfaction">
                <v-card flat>
                  <v-card-text>
                    {{ $t("the satisfaction survey will be available once the ticket is closed") }}
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 xl4 lg4 sm12 pt-0 pl-2 pr-2>
        <v-layout row wrap pt-0>
          <v-flex xs12 md12 sm12 xl12 lg12 pt-4>
            <v-card light color="white" class="px-4 pb-3">
              <v-card-title primary-title>
                <h3 class="headline mb-0">{{ $t("Service deadlines") }}</h3>
              </v-card-title>
              <v-divider></v-divider>
              {{ $t("Supported") }}
              <cns-progress-bar :ticket="ticket" :cnsType="'supported'"></cns-progress-bar>
              {{ $t("Bypass") }}
              <cns-progress-bar :ticket="ticket" :cnsType="'bypassed'"></cns-progress-bar>
              {{ $t("Solution") }}
              <cns-progress-bar :ticket="ticket" :cnsType="'resolved'"></cns-progress-bar>
            </v-card>
          </v-flex>
          <v-flex xs12 md12 sm12 xl12 lg12 pt-4 align-center justify-center>
            <h4
              class="text-uppercase text-md-center text-xs-center blue white--text pt-2 pb-1"
            >{{ $t("interlocutor in charge of the request") }}</h4>
            <v-card class="pt-2 px-5 nobottomshadow">
              <v-icon large color="blue" class="arrow-down pr-5 pt-1">play_arrow</v-icon>
              <v-layout ml-5 pl-5 row class="center-avatar" v-if="request.responsible">
                <v-flex shrink px-1 xs12>
                  <v-avatar size="60" class="pt-0">
                    <v-img :src="`${apiUrl}/api/users/${request.responsible._id}/profile/avatar`"></v-img>
                  </v-avatar>
                </v-flex>

                <v-flex grow pa-1 xs12>
                  <v-card-text v-if="request.responsible">
                    <strong>{{ $t("Contact") }} :</strong>
                    {{ request.responsible && request.responsible.name }}
                    <br />
                    <strong>{{ $t("E-mail") }} :</strong>
                    {{ request.responsible && request.responsible.email }}
                  </v-card-text>
                  <v-card-text v-else>
                    <h4>{{ $t("No interlocutor in charge of the request at the moment") }}</h4>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
            <h4
              class="text-uppercase text-md-center text-xs-center blue white--text pt-2 pb-1"
            >{{ $t("Beneficiary") }}</h4>
            <v-card class="pt-2 px-5">
              <v-icon large class="arrow-down pr-5 pt-1 blue-color">play_arrow</v-icon>
              <v-layout ml-5 pl-5 row class="center-avatar" v-if="request.beneficiary">
                <v-flex shrink px-1 xs12>
                  <v-avatar size="60" class="pt-0">
                    <v-img :src="`${apiUrl}/api/users/${request.beneficiary.id}/profile/avatar`"></v-img>
                  </v-avatar>
                </v-flex>
                <v-flex grow pa-1 xs12>
                  <v-card-text>
                    <strong>{{ $t("Contact") }} :</strong>
                    {{ request.beneficiary && request.beneficiary.name }}
                    <br />
                    <span class="body-2">{{ $t("Client") }} / {{ $t("Contract") }} :&nbsp;</span>
                    <router-link
                      :to="{ name: 'Client', params: { id: request.contract.clientId } }"
                    >
                      <a
                        class="blue-color"
                        href="#"
                      >{{ request.contract && request.contract.client }}</a>
                    </router-link>/
                    <router-link :to="{ name: 'Contract', params: { id: request.contract._id } }">
                      <a class="blue-color" href="#">{{ request.contract && request.contract.name }}</a>
                    </router-link>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { VueEditor } from "vue2-editor";
import { capitalize } from "lodash";
import { Editor } from "vuetify-markdown-editor";
import AttachmentsCreation  from "@/components/attachments/creation/Attachments.vue";
import ApplicationSettings from "@/services/application-settings";
import cnsProgressBar from "@/components/CnsProgressBar";

const NEXT_STATUS = {
  new: "supported",
  supported: "bypassed",
  bypassed: "resolved",
  resolved: "closed"
};

export default {
  data() {
    return {
      attachments: [],
      commentCreationAttachments: [],
      ticket: {
        events: []
      },
      cnsSupported: 0,
      cnsBypassed: 0,
      cnsResolved: 0,
      supportedDuration: 0,
      resolvedDuration: 0,
      bypassedDuration: 0,
      currentStatus: "",
      applicationSettings: {},
      commentBtn: true,
      selectedEditor: "wysiwyg",
      privateComment: false,
      events: [],
      newStatus: "",
      newResponsible: "",
      newEvent: {},
      request: {
        statusId: 2,
        events: []
      },
      comment: "",
      options: {
        lineNumbers: true,
        styleActiveLine: true,
        styleSelectedText: true,
        lineWrapping: true,
        indentWithTabs: true,
        tabSize: 2,
        indentUnit: 2
      },
      contractUsers: [],
      connectedUser: {
        type: "expert"
      }
    };
  },
  components: {
    VueEditor,
    Editor,
    AttachmentsCreation,
    "cns-progress-bar": cnsProgressBar
  },
  computed: {
    ...mapGetters({
      email: "user/getEmail",
      avatarUrl: "user/getAvatarUrl",
      displayName: "user/getDisplayName",
      getUser: "user/getUser"
    }),
    ticketStatusId() {
      if (this.ticket.status) {
        switch (this.ticket.status.toLowerCase()) {
          case "new":
            return 0;
          case "supported":
            return 1;
          case "bypassed":
            return 2;
          case "resolved":
            return 3;
          case "closed":
            return 4;
        }
      } else {
        return 0;
      }
    },

    allowedStatusList() {
      const currentStatus = this.currentStatus.toLowerCase();

      return NEXT_STATUS[currentStatus];
    },

    allowedAssigneeList() {
      const assignees = this.contractUsers.map(this.getContractUserAsAssignee);

      return ["resolved", "closed"].includes(this.currentStatus)
        ? assignees.filter(assignee => assignee.type === "beneficiary")
        : assignees;
    }
  },
  methods: {
    scrollToEvent(event) {
      const element = this.$refs[`event-${event._id}`];

      if (element && element[0] && element[0].$el) {
        this.$scrollTo(element[0].$el, { offset: -80 });
      }
    },
    getContractUserAsAssignee(contractUser) {
      return {
        type: contractUser.type,
        role: contractUser.role,
        id: contractUser.user._id,
        _id: contractUser.user._id,
        email: contractUser.user.preferredEmail,
        name: contractUser.user.displayName || contractUser.user.preferredEmail
      };
    },

    setRequestData(request) {
      this.attachments = request.events && request.events.map(event => {
        return (event.attachments || []).map(attachment => {
          attachment.timestamps = event.timestamps;
          attachment.event = event;

          return attachment;
      })}).flat();
      this.currentStatus = request.status;
      this.request.statusId = 1;
      this.request.files = [];
      this.request.lastUpdate = new Date(request.timestamps.updatedAt);
      this.request.ticketDate = new Date(request.timestamps.createdAt);
      this.request.subject = request.description;
      this.events = request.events;
      this.request.linkedTickets = request.relatedRequests;
      this.request.communityContribution = {};
    },
    addEvent() {
      this.commentBtn = false;
      const attachmentsPromise = this.commentCreationAttachments.length ?
        this.$http.getUploader().uploadAll(this.commentCreationAttachments) :
        Promise.resolve([]);

      attachmentsPromise
        .then(attachments => this.postEvent(attachments))
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("updated"),
            color: "success"
          });
          this.resetComment();
          this.getData();
        })
        .catch(err => {
          console.log(err);
          this.$store.dispatch("ui/displaySnackbar", {
            message: "Error while updating ticket",
            color: "error"
          });
        })
        .finally(() => {
          this.commentBtn = true;
        });
    },
    postEvent(attachments = []) {
      this.newEvent = {
        author: {
          id: this.$store.state.user.user._id,
          name: this.displayName,
          image: this.avatarUrl,
          type: this.getUser.type
        }
      };

      this.newEvent.comment = this.comment;

      if (attachments.length) {
        this.newEvent.attachments = attachments.map(attachment => ({
          _id: attachment._id, name: attachment.name, mimeType: attachment.type
        }));
      }

      this.newEvent.status = this.newStatus;
      this.newEvent.target = this.newResponsible;

      return this.$http.addTicketEvent(this.ticket._id, this.newEvent);
    },
    downloadFile({ _id, name }) {
      this.$http.downloadFile(_id).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    },
    getData() {
      this.$http.getTicketById(this.$route.params.id).then(response => {
        this.ticket = Object.assign({}, response.data);
        this.request = Object.assign({}, response.data);
        this.setRequestData(Object.assign({}, response.data));

        this.$http.getContractUsers(this.request.contract._id)
          .then(contractUsers => (this.contractUsers = contractUsers));
      });

      this.$http.getConnectedUserId().then(res => {
        this.$http.getUserById(res.data._id).then(user => {
          if (user.data) {
            this.connectedUser = user.data;
          }
        });
      });

      this.apiUrl = ApplicationSettings.VUE_APP_OPENPAAS_URL;
    },
    resetComment() {
      this.newStatus = "";
      this.comment = "";
      this.newResponsible = "";
      this.privateComment = false;
      this.commentCreationAttachments = [];
      this.commentCreationAttachments.length = 0;
    },

    capitalize(text) {

      return capitalize(text);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="stylus" scoped>
.center-avatar {
  align-items: center;
}

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

.container {
  max-width: 100% !important;
  padding: 0px;
}

.container.grid-list-md .layout .flex {
  padding: 6px;
}

.quillWrapper, .ql-editor {
  width: 100%;
}

.arrow-down {
  transform: rotate(90deg);
  position: absolute;
  left: 45%;
  width: 10%;
}

#crumbs {
  text-align: center;
}

#crumbs ul {
  list-style: none;
  display: inline-table;
}

#crumbs ul li {
  display: inline;
}

#crumbs ul li a {
  display: block;
  float: left;
  height: 50px;
  background: #3498db;
  text-align: center;
  padding: 30px 40px 0 80px;
  position: relative;
  margin: 0 10px 0 0;
  font-size: 20px;
  text-decoration: none;
  color: #fff;
}

#crumbs ul li a:after {
  content: '';
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
  border-left: 40px solid #3498db;
  position: absolute;
  right: -40px;
  top: 0;
  z-index: 1;
}

#crumbs ul li a:before {
  content: '';
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
  border-left: 40px solid #d4f2ff;
  position: absolute;
  left: 0;
  top: 0;
}

#crumbs ul li:first-child a {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

#crumbs ul li:first-child a:before {
  display: none;
}

#crumbs ul li:last-child a {
  padding-right: 80px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

#crumbs ul li:last-child a:after {
  display: none;
}

#crumbs ul li a:hover {
  background: #fa5ba5;
}

#crumbs ul li a:hover:after {
  border-left-color: #fa5ba5;
}

.comment-mine {
  background-color: #eaf6ff !important;
  border-radius: 20px !important;
  padding: 10px !important;
  margin: 10px !important;
  width: 90% !important;
  float: left !important;
}

.comment-not-mine {
  background-color: #f5f5f5 !important;
  border-radius: 20px !important;
  padding: 10px !important;
  margin: 10px !important;
  width: 90% !important;
  float: right !important;
}

.custom-comment-box {
  width: 100% !important;
}

.comment-not-mine div {
  background-color: #f5f5f5 !important;
}

.comment-mine div {
  background-color: #eaf6ff !important;
}

.v-expansion-panel__body .flex.xs2 {
  width: auto;
  float: left;
}

.v-expansion-panel__body .flex.xs2 {
  width: 80%;
  float: left;
}

.v-expansion-panel__body .v-card__text.grey--text.font-italic {
  float: right;
  width: 100%;
}

.noshadow {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}

.nobottomshadow {
  box-shadow: 0 rgba(0, 0, 0, 0.2), 0px 0px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.avatar-width {
  width: 70% !important;
}

.mx-3 {
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.pb-2 {
  padding-left: 24px !important;
  padding-bottom: 24px !important;
}

.blue-bg {
  background-color: #2195f2 !important;
  color: #ffffff !important;
}

.blue-color {
  color: #2195f2 !important;
}

@media only screen and (max-width: 575px) {
  .layout.row.wrap.justify-space-between {
    margin: 0px !important;
    min-width: 100% !important;
  }
}

@media only screen and (max-width: 1263px) {
  .layout.row.wrap.justify-space-between {
    margin: 0px !important;
    min-width: 100% !important;
  }
}

.mr-5 {
  margin-right: 30px !important;
}

.v-input__icon.v-input__icon--prepend {
  margin: 0px !important;
}

.layout.row.wrap {
  /* margin-left: 0px !important; */
  /* padding-top: 10px !important; */
}

.custom-comment-btn {
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.label.file-upload-label {
  padding-left: 0px !important;
}

.grid-list-md {
  padding-left: 0px !important;
}

.fluid {
  padding-right: 24px !important;
  padding-left: 0px !important;
}

.custom-ticket-bl {
  margin-left: 16px !important;
}
</style>
