<template>
  <v-container grid-list-md>
    <v-card-text>
      <router-link :to="{ name: 'Requests' }">
        <button><v-icon>arrow_back</v-icon></button>
      </router-link>
      <!-- <a href="#" disabled class="text-lg-left action-links">
        <v-icon class="mr-2">bug_report</v-icon>
        {{ $t("REQUEST VIEW") }}
      </a> -->
      <a href="#" class="action-links right">
        <v-icon class="mr-2">backup</v-icon>
        {{ $t("EXPORT SHEET (CSV)") }}
      </a>
      <a href="#" class="action-links mr-5 right">
        <v-icon class="mr-2">print</v-icon>
        {{ $t("PRINT SHEET") }}
      </a>
    </v-card-text>
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
                <v-btn color="primary" fab small dark to="#">
                  <v-icon>edit</v-icon>
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
          <v-divider class="pb-2" />
          <v-layout justify-center row fill-height wrap ml-3 class="custom-ticket-bl">
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Type") }} :</strong>
              {{ request.type }}
            </v-flex>

            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Severity") }} :</strong>
              {{ request.severity }}
            </v-flex>
            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Created at") }} :</strong>
              {{ request.ticketDate }}
            </v-flex>
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Created by") }} :</strong>
              {{ request.author.name }}
            </v-flex>

            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Assigned to") }} :</strong>
              {{ (request.assignedTo && request.assignedTo.name) || $t("not assigned yet") }}
            </v-flex>
            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Last update") }} :</strong>
              {{ request.lastUpdate }}
            </v-flex>
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Software") }} :</strong>
              {{ request.software.name }}
            </v-flex>
            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Version") }} :</strong>
              {{ request.software.version }}
            </v-flex>
            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("OS") }} :</strong>
              {{ request.software.os }}
            </v-flex>
          </v-layout>
          <v-divider class="mt-2"></v-divider>
          <v-card>
            <v-card-text>
              <v-layout>
                <v-flex xs1 md1 sm1 lg1 xl1>
                  <v-icon>subject</v-icon>
                </v-flex>
                <v-flex xs11 md9 sm10 lg10 xl9 class="pt-0 pl-0">
                  <div class="subject-text" v-html="request.description"></div>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text class="pb-0" v-if="ticket.files.length">
              <v-layout>
                <v-flex xs1 md1 sm1 lg1 xl1>
                  <v-icon>attach_file</v-icon>
                </v-flex>
                <v-flex xs9 md11 sm8 xl9 lg10 pl-0>
                  <v-layout>
                    <v-flex xs10 md2 sm6 lg2 xl2 pl-0>
                      <b>{{ $t("Attachments") }}:</b>
                    </v-flex>
                    <v-flex xs12 md8 sm6 lg10 xl8 pl-0>
                      <ul v-if="ticket.files.length">
                        <li v-for="(file, key) in ticket.files" :key="key">
                          <a href="#" @click="downloadFile(file.id, file.name)">
                            {{ file.name }}
                          </a>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text v-if="request.linkedTickets.length > 0">
              <v-layout>
                <v-flex xs1 md1 sm1 lg1 xl1>
                  <v-icon>insert_link</v-icon>
                </v-flex>
                <v-flex xs12 md11 sm8 xl10 lg10 pl-0>
                  <v-layout row wrap>
                    <v-flex xs6 md2 sm6 lg2 xl2 pl-0>
                      <strong>{{ $t("Related requests") }}:</strong>
                    </v-flex>
                    <v-flex xs10 md8 sm6 lg8 xl6 pl-0>
                      <ul v-if="request.linkedTickets.length > 0">
                        <li v-for="(link, key) in request.linkedTickets" :key="key">
                          <span v-if="link.type == 'duplicate'">{{ $t("is a copy of ticket") }}&nbsp;</span>
                          <span v-else-if="link.type == 'closes'">{{ $t("closes ticket") }}&nbsp;</span>
                          <router-link :to="{ name: 'Request', params: { id: link.id } }">{{
                            link.request
                          }}</router-link>
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
              <v-tab href="#satisfaction">{{ $t("satisfaction after closure") }}</v-tab>
              <v-tab-item value="comment" class="mt-1">
                <v-card flat pt2>
                  <v-expansion-panel v-model="panel" expand>
                    <div v-for="comment in comments" :key="comment._id" class="custom-comment-box">
                      <v-expansion-panel-content
                        :class="comment.isBeneficiary ? 'comment-not-mine' : 'comment-mine'"
                        color="grey lighten-4"
                      >
                        <template v-slot:header>
                          <div class="font-weight-bold">
                            {{ comment.author.name }}
                            <span class="subheading"> {{ comment.date | calendarTimeFilter }} </span>
                            <span v-if="comment.actions.isPrivateComment" class="red--text font-italic">
                              {{ $t("private comment") }}
                            </span>
                          </div>
                        </template>
                        <v-card class="ml-4">
                          <v-layout row wrap>
                            <v-flex xs2 md1 sm2 lg2 xl2>
                              <v-avatar size="60" :tile="false" v-if="comment.author.image">
                                <v-img :src="comment.author.image ? comment.author.image : ''"></v-img>
                              </v-avatar>
                            </v-flex>
                            <v-flex xs10>
                              <v-card-text v-html="comment.body"></v-card-text>
                              <v-card-text v-if="comment.actions.assignedTo.name" class="grey--text font-italic">
                                {{ $t("Ticket assigned to ") }}
                                <strong> {{ comment.actions.assignedTo.name }} </strong>
                              </v-card-text>
                              <v-card-text v-if="comment.actions.newStatus" class="grey--text font-italic">
                                {{ $t("Ticket passed in status ") }}
                                <strong> {{ comment.actions.newStatus }} </strong>
                              </v-card-text>
                              <v-card-text v-if="comment.attachedFile.name">
                                <v-icon>attach_file</v-icon>
                                <a @click="downloadFile(comment.attachedFile.id, attachedFile)">
                                  {{ comment.attachedFile.name }}
                                </a>
                              </v-card-text>
                            </v-flex>
                          </v-layout>
                        </v-card>
                      </v-expansion-panel-content>
                    </div>
                  </v-expansion-panel>
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
                        <v-flex xs10 md8 sm8 xl3 lg2>
                          <v-select
                            :items="allowedStatusList"
                            v-model="newStatus"
                            :label="$t('Status')"
                            item-text="value"
                            item-value="key"
                          ></v-select>
                        </v-flex>
                        <v-flex xs10 md8 sm8 xl3 lg3>
                          <v-select
                            :items="assignee"
                            item-text="name"
                            v-model="newResponsible"
                            :label="$t('Assigned to')"
                            return-object
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 md8 sm8 xl3 lg3>
                          <v-checkbox
                            v-model="privateComment"
                            color="primary"
                            :label="$i18n.t('private comment')"
                          ></v-checkbox>
                        </v-flex>
                        <v-flex xs12 md8 sm8 xl3 lg3>
                          <v-upload :label="$i18n.t('Attach file')" v-model="commentFile"></v-upload>
                        </v-flex>
                      </v-layout>
                    </v-input>
                    <v-layout row wrap>
                      <v-flex xs1 md4 sm4 lg4 xl4></v-flex>
                      <v-flex xs2 md4 sm4 lg4 xl4>
                        <v-btn color="info" class="custom-comment-btn" @click="addComment" :disabled="!commentBtn">{{
                          $t("Add comment")
                        }}</v-btn>
                      </v-flex>
                      <v-flex xs4 md4 sm4 lg4 xl4></v-flex>
                    </v-layout>
                  </v-form>
                </v-card>
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
            <h4 class="text-uppercase text-md-center text-xs-center blue white--text pt-2 pb-1">
              {{ $t("interlocutor in charge of the request") }}
            </h4>
            <v-card class="pt-2 nobottomshadow">
              <v-icon large color="blue" class="arrow-down pr-5 pt-1">play_arrow</v-icon>
              <br />
              <v-layout row wrap v-if="request.responsible">
                <v-flex xs8 md8 sm6 lg8 xl6>
                  <v-avatar size="100%" class="pl-1 avatar-width">
                    <v-img :src="`${apiUrl}/api/users/${request.responsible._id}/profile/avatar`"></v-img>
                  </v-avatar>
                </v-flex>
              </v-layout>

              <v-card-text v-if="request.responsible">
                <strong>{{ $t("Contact") }} :</strong>
                {{ request.responsible && request.responsible.name }}
                <br />
                <strong>{{ $t("eMail") }} :</strong>
                {{ request.responsible && request.responsible.email }}
              </v-card-text>
              <v-card-text v-else>
                <h4>
                  {{ $t("No interlocutor in charge of the request at the moment") }}
                </h4>
              </v-card-text>
            </v-card>
            <h4 class="text-uppercase text-md-center text-xs-center blue white--text pt-2 pb-1">
              {{ $t("Beneficiary") }}
            </h4>
            <v-card class="pt-2">
              <v-icon large class="arrow-down pr-5 pt-1 blue-color">play_arrow</v-icon>
              <v-layout row wrap>
                <v-flex xs3 md2 sm4 lg4 xl4></v-flex>
                <v-flex xs8 md8 sm6 lg8 xl6>
                  <v-avatar size="100%" class="pl-1 avatar-width">
                    <v-img v:src="`${apiUrl}/api/users/${request.beneficiary.id}/profile/avatar`"></v-img>
                  </v-avatar>
                </v-flex>
              </v-layout>

              <v-card-text>
                <strong>{{ $t("Contact") }} :</strong>
                {{ request.beneficiary.name }}
                <br />
                <span class="body-2">{{ $t("Client") }} / {{ $t("Contract") }} :&nbsp;</span>
                <router-link :to="{ name: 'Client', params: { id: request.contract.clientId } }">
                  <a class="blue-color" href="#">{{ request.contract.client }}</a>
                </router-link>
                /
                <router-link :to="{ name: 'Contract', params: { id: request.contract._id } }">
                  <a class="blue-color" href="#">{{ request.contract.name }}</a>
                </router-link>
              </v-card-text>
            </v-card>
          </v-flex>
          <!--<v-flex xs12 md12 sm12 xl12 lg12 pt-4 v-if="request.communityContribution.status">
            <v-card light color="white">
              <v-card light color="white pb-2 pr-4">
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">
                      {{ $t("Community contribution progress") }}
                    </h3>
                  </div>
                </v-card-title>
                <v-divider></v-divider>
                <v-layout class="mb-1 ml--1 mr-4">
                  <v-flex xs2 md3 sm3 lg2 xl2 pl-0 class="green--text font-weight-bold">
                    <v-icon
                      class="progress-arrow"
                      :class="{
                        'green--text': request.communityContribution.status.dev
                      }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("Dev") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{
                        'green--text': request.communityContribution.status.reversed
                      }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("Reversed") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{
                        'green--text': request.communityContribution.status.integrated
                      }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("Integrated") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{
                        'green--text': request.communityContribution.status.published
                      }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("published") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{
                        'green--text': request.communityContribution.status.rejected
                      }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("Rejected") }}</small>
                  </v-flex>
                </v-layout>
                <h3>{{ $t("Community contribution form") }}:</h3>
                <a :href="request.communityContribution.communityIssueLink">
                  {{ request.communityContribution.communityIssueLink }}
                </a>
              </v-card>
            </v-card>
          </v-flex>-->
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { VueEditor } from "vue2-editor";
import { Editor } from "vuetify-markdown-editor";
import VUpload from "vuetify-upload-component";
import ApplicationSettings from "@/services/application-settings";
import cnsProgressBar from "@/components/CnsProgressBar";

export default {
  data() {
    return {
      ticket: {
        comments: []
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
      panel: [true, true],
      comments: [],
      newStatus: "",
      newResponsible: "",
      request: {
        statusId: 2,
        comments: []
      },
      commentFile: [],
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
      statusList: [
        {
          key: "supported",
          value: this.$i18n.t("Supported")
        },
        {
          key: "bypassed",
          value: this.$i18n.t("Bypassed")
        },
        {
          key: "resolved",
          value: this.$i18n.t("Resolved")
        },
        {
          key: "closed",
          value: this.$i18n.t("Closed")
        }
      ],
      assignee: [],
      connectedUser: {
        type: "expert"
      }
    };
  },
  components: {
    VueEditor,
    Editor,
    VUpload,
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
      switch (this.currentStatus.toLowerCase()) {
        case "new":
          return this.statusList;
        case "supported":
          return this.statusList.filter(statusCode => statusCode.key != "new");
        case "bypassed":
          return this.statusList.filter(statusCode => statusCode.key != "new" && statusCode.key != "supported");
        case "resolved":
          return this.statusList.filter(
            statusCode => statusCode.key != "new" && statusCode.key != "supported" && statusCode.key != "bypassed"
          );
        case "closed":
          return [this.statusList[this.statusList.length - 1]];
        default:
          return [];
      }
    }
  },
  methods: {
    setRequestData(request) {
      this.currentStatus = request.status;
      this.request.statusId = 1;
      this.request.files = [];
      this.request.lastUpdate = new Date(request.timestamps.updatedAt).toDateString();
      this.request.ticketDate = new Date(request.timestamps.createdAt).toDateString();
      this.request.subject = request.description;
      this.comments = request.comments;
      this.panel = request.comments.map(() => true);
      this.request.linkedTickets = request.relatedRequests;
      this.request.communityContribution = {};

      if (!request.author) {
        this.request.author = this.getUser;
      }
    },
    addComment() {
      if (this.commentFile.length) {
        this.commentBtn = false;
        let commentFile = this.commentFile[0];
        let fileSize = commentFile.size;
        let mimeType = commentFile.type;
        let formData = new FormData();
        formData.append("file", commentFile);
        this.$http
          .uploadFile(formData, mimeType, fileSize, commentFile.name)
          .then(response => {
            this.postComment(response.data._id, commentFile.name);
            this.commentBtn = true;
            this.commentFile = [];
          })
          .catch(error => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: error.response.data.error.details,
              color: "error"
            });
            this.commentBtn = true;
          });
      } else {
        this.postComment();
      }
    },
    postComment(fileId = "", fileName = "") {
      this.ticket.comments.push({
        date: new Date(),
        body: this.comment,
        author: {
          id: this.$store.state.user.user._id,
          name: this.displayName,
          image: this.avatarUrl
        },
        attachedFile: {
          id: fileId,
          name: fileName,
          mimeType: this.commentFile.length ? this.commentFile[0].type : ""
        },
        actions: {
          assignedTo: this.newResponsible,
          newStatus: this.newStatus,
          isPrivateComment: this.privateComment
        },
        isBeneficiary: this.connectedUser.type === "beneficiary"
      });
      if (this.newStatus) {
        this.ticket.status = this.newStatus;
      }
      if (this.ticket.logs && this.ticket.logs.length) {
        let previousLog = this.ticket.logs[this.ticket.logs.length - 1];
        if (
          previousLog.assignedTo &&
          previousLog.assignedTo.type == "beneficiary" &&
          this.newResponsible.type == "beneficiary"
        ) {
          // What is that for ?
        } else {
          this.ticket.logs.push({
            action: this.newStatus,
            author: this.$store.state.user.user._id,
            date: new Date(),
            assignedTo: this.newResponsible
          });
        }
      } else {
        this.ticket.logs.push({
          action: this.newStatus,
          author: this.$store.state.user.user._id,
          date: new Date(),
          assignedTo: this.newResponsible
        });
      }
      this.$http
        .updateTicket(this.ticket._id, this.ticket)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("updated"),
            color: "success"
          });
          this.newStatus = "";
          this.comment = "";
          this.newResponsible = "";
          this.panel.push(true);
          this.getData();
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },
    getPreviousAction(logs, date, action) {
      let previousActions = [];
      previousActions = logs.filter(log => {
        let actionDate = new Date(log.date);
        return actionDate.getTime() < date.getTime() && log.action != action;
      });

      return previousActions[previousActions.length - 1];
    },
    getNextAction(logs, date, action) {
      let nextActions = [];
      nextActions = logs.filter(log => {
        let actionDate = new Date(log.date);
        return actionDate.getTime() > date.getTime() && log.action != action;
      });

      return nextActions[0];
    },
    parseDuration(duration) {
      let remain = duration;

      let days = Math.floor(remain / (1000 * 60 * 60 * 24));
      remain = remain % (1000 * 60 * 60 * 24);

      let hours = Math.floor(remain / (1000 * 60 * 60));
      remain = remain % (1000 * 60 * 60);

      let minutes = Math.floor(remain / (1000 * 60));
      remain = remain % (1000 * 60);

      let seconds = Math.floor(remain / 1000);
      remain = remain % 1000;

      let milliseconds = remain;

      return {
        days,
        hours,
        minutes,
        seconds,
        milliseconds
      };
    },
    downloadFile(fileId, fileName) {
      this.$http.downloadFile(fileId).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    },
    getData() {
      this.$http.getTicketById(this.$route.params.id).then(response => {
        this.ticket = Object.assign({}, response.data);
        this.request = Object.assign({}, response.data);
        this.setRequestData(Object.assign({}, response.data));
      });

      this.$http.listUsers().then(response => {
        this.assignee = response.data;
      });

      this.$http.getConnectedUserId().then(res => {
        this.$http.getUserById(res.data._id).then(user => {
          if (user.data) {
            this.connectedUser = user.data;
          }
        });
      });

      this.$store.dispatch("sidebar/setSidebarComponent", "issue-detail-side-bar");
      this.apiUrl = ApplicationSettings.VUE_APP_OPENPAAS_URL;
    }
  },
  // updated() {
  //   var progressBars = document.getElementsByClassName("v-progress-linear");
  //   for (let index = 0; index < progressBars.length; index++) {
  //     var element = progressBars[index];
  //     var value = element.getElementsByClassName("v-progress-linear__content")[0].innerHTML;
  //     var newValueRegion = element.getElementsByClassName("v-progress-linear__bar__determinate");
  //     newValueRegion[0].innerHTML = value;
  //     element.getElementsByClassName("v-progress-linear__content")[0].innerHTML = "";
  //   }
  // },
  created() {
    this.getData();
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  }
};
</script>

<style lang="stylus" scoped>
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

.v-expansion-panel.theme--light, .v-expansion-panel__container {
  border: none !important;
  box-shadow: none !important;
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
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
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

.v-card__text {
  padding-top: 16px !important;
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
