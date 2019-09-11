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
                    v-if="ticketStatusId == 1"
                    step
                    complete
                    color="primary"
                    complete-icon="access_time"
                    class="current_step"
                    >{{ $t("Supported") }}</v-stepper-step
                  >
                  <v-stepper-step v-else-if="ticketStatusId < 1" step>{{ $t("Supported") }}</v-stepper-step>
                  <v-stepper-step v-else step complete color="success">{{ $t("Supported") }}</v-stepper-step>

                  <v-divider v-if="ticketStatusId < 2"></v-divider>
                  <v-divider v-else color="success"></v-divider>
                  <v-stepper-step
                    v-if="ticketStatusId == 2"
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
                    v-if="ticketStatusId == 3"
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
                  <v-stepper-step v-if="ticketStatusId < 4" step>{{ $t("Closed") }}</v-stepper-step>
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
                  <h3 class="headline mb-0">#{{ request.ticketNumber }} - {{ request.title }}</h3>
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
              <strong>{{ $t("severity") }} :</strong>
              {{ request.severity }}
            </v-flex>
            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Created at") }} :</strong>
              {{ request.ticketDate }}
            </v-flex>
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Created by") }} :</strong>
              {{ request.ticketAuthor }}
            </v-flex>

            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Assigned to") }} :</strong>
              {{ request.responsible.name || request.responsible.displayName || $t("not assigned yet") }}
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
            <v-card-text v-if="request.linkedTickets.length">
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
                      <ul v-if="request.linkedTickets.length">
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
              <v-tab href="#comment">{{ $t("comments") }}</v-tab>
              <v-tab href="#satisfaction">{{ $t("satisfaction after closure") }}</v-tab>
              <v-tab-item value="comment" class="mt-1">
                <v-card flat pt2>
                  <v-expansion-panel v-model="panel" expand>
                    <div v-for="comment in comments" :key="comment._id" class="custom-comment-box">
                      <v-expansion-panel-content
                        v-if="comment.authorid == 1"
                        class="comment-mine"
                        color="grey lighten-4"
                      >
                        <template v-slot:header>
                          <div class="font-weight-bold">
                            <span class="subheading">{{ comment.name }}</span>
                            {{ comment.date }}
                          </div>
                        </template>
                        <v-card class="ml-4">
                          <v-layout row wrap>
                            <v-flex xs2 md1 sm2 lg2 xl2>
                              <v-avatar size="60" :tile="false" v-if="comment.image">
                                <v-img :src="comment.image ? comment.image : ''"></v-img>
                              </v-avatar>
                            </v-flex>
                            <v-flex xs10 md10 sm10 lg10 xl10>
                              <v-card-text>{{ comment.body }}</v-card-text>
                              <v-card-text v-if="comment.attachedFile">
                                <v-icon>attach_file</v-icon>
                                <router-link :to="`${apiUrl}/api/files/${comment.attachment}`" target="_blank">
                                  {{ comment.attachedFile }}
                                </router-link>
                              </v-card-text>
                              <v-card-text v-if="comment.actions" class="grey--text font-italic">
                                <span v-for="(action, keya) in comment.actions" :key="keya">
                                  {{ action.action }}
                                  <br />
                                </span>
                              </v-card-text>
                            </v-flex>
                          </v-layout>
                        </v-card>
                      </v-expansion-panel-content>
                      <v-expansion-panel-content
                        v-if="comment.authorid !== 1"
                        class="comment-not-mine"
                        color="grey lighten-4"
                      >
                        <template v-slot:header>
                          <div class="font-weight-bold">
                            <span class="subheading">{{ comment.name }}</span>
                            {{ comment.date }}
                          </div>
                        </template>
                        <v-card class="ml-4">
                          <v-layout row wrap>
                            <v-flex xs2 md1 sm2 lg2 xl2>
                              <v-avatar size="60" :tile="false" v-if="comment.image">
                                <v-img :src="comment.image ? comment.image : ''"></v-img>
                              </v-avatar>
                            </v-flex>
                            <v-flex xs10>
                              <v-card-text v-html="comment.body"></v-card-text>
                              <v-card-text v-if="comment.attachedFile">
                                <v-icon>attach_file</v-icon>
                                <a href="#" @click="downloadFile(comment.attachment, attachedFile)">
                                  {{ comment.attachedFile }}
                                </a>
                              </v-card-text>
                              <v-card-text v-if="comment.actions" class="grey--text font-italic">
                                <span v-for="(action, keya) in comment.actions" :key="keya">
                                  {{ action.action }}
                                  <br />
                                </span>
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
                            :items="statusList"
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
                          $t("add comment")
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
              <v-layout row wrap>
                <v-flex xs9 md9 sm9 xl9 lg9 class="px-1 pt-0 pb-0 text-xs-center">
                  <v-progress-linear
                    ref="supportedBar"
                    height="18"
                    :value="percentage(cnsSupported, supportedDuration)"
                    :color="getEngagementColor(cnsSupported, supportedDuration)"
                    class="mt-0 white--text font-weight-bold"
                    >{{ cnsSupported }} HO</v-progress-linear
                  >
                </v-flex>
                <v-flex xs2 md2 sm2 lg2 xl2 px-1 pt-0 pb-0>{{ supportedDuration }} HO</v-flex>
                <v-flex xs1 md1 sm1 lg1 xl1 px-1 pt-0 pb-0>
                  <v-icon color="#249CC7">access_time</v-icon>
                </v-flex>
              </v-layout>
              {{ $t("Bypass") }}
              <v-layout row wrap>
                <v-flex xs9 md9 sm9 xl9 lg9 class="px-1 pt-0 pb-0 text-xs-center">
                  <v-progress-linear
                    ref="bypassedBar"
                    color="#CFCFCF"
                    height="18"
                    :value="percentage(cnsBypassed, bypassedDuration)"
                    :color="getEngagementColor(cnsBypassed, bypassedDuration)"
                    class="mt-0 white--text font-weight-bold"
                    >{{ cnsBypassed }} HO</v-progress-linear
                  >
                </v-flex>
                <v-flex xs2 md2 sm2 lg2 xl2 px-1 pt-0 pb-0>{{ bypassedDuration }} HO</v-flex>
              </v-layout>
              {{ $t("Solution") }}
              <v-layout row wrap>
                <v-flex xs9 md9 sm9 xl9 lg9 class="px-1 pt-0 pb-0 text-xs-center">
                  <v-progress-linear
                    height="18"
                    ref="resolvedBar"
                    :value="percentage(cnsResolved, resolvedDuration)"
                    :color="getEngagementColor(cnsResolved, resolvedDuration)"
                    class="mt-0 white--text font-weight-bold"
                    >{{ cnsResolved }} HO</v-progress-linear
                  >
                </v-flex>
                <v-flex xs2 md2 sm2 lg2 xl2 px-1 pt-0 pb-0>{{ resolvedDuration }} HO</v-flex>
                <v-flex xs1 md1 sm1 lg1 xl1 px-1 pt-0 pb-0></v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xs12 md12 sm12 xl12 lg12 pt-4 align-center justify-center>
            <h4 class="text-uppercase text-md-center text-xs-center blue white--text pt-2 pb-1" v-if="request.inCharge">
              {{ $t("interlocutor in charge of the request") }}
            </h4>
            <v-card class="pt-2 nobottomshadow" v-if="request.inCharge">
              <v-icon large color="blue" class="arrow-down pr-5 pt-1">play_arrow</v-icon>
              <br />
              <v-layout row wrap>
                <v-flex xs3 md2 sm4 lg4 xl4></v-flex>
                <v-flex xs8 md8 sm6 lg8 xl6>
                  <v-avatar size="100%" class="pl-1 avatar-width">
                    <v-img
                      :src="`${apiUrl}/api/users/${request.inCharge.user._id}/profile/avatar`"
                      v-if="request.inCharge.user"
                    ></v-img>
                    <v-img :src="`${apiUrl}/api/users/${request.inCharge._id}/profile/avatar`" v-else></v-img>
                  </v-avatar>
                </v-flex>
              </v-layout>

              <v-card-text>
                <strong>{{ $t("Contact") }} :</strong>
                {{ request.inCharge.displayName || request.inCharge.name }}
                <br />
                <strong>{{ $t("Phone") }} :</strong>
                {{ request.inCharge.phone }}
                <br />
                <strong>{{ $t("eMail") }} :</strong>
                {{ request.inCharge.email }}
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
                    <v-img :src="`${apiUrl}/api/users/${request.beneficiary._id}/profile/avatar`"></v-img>
                  </v-avatar>
                </v-flex>
              </v-layout>

              <v-card-text>
                <strong>{{ $t("Contact") }} :</strong>
                {{ request.beneficiary.name || request.beneficiary.displayName }}
                <br />
                <strong>{{ $t("Phone") }} :</strong>
                {{ request.beneficiary.phone }}
                <br />
                <span class="body-2">{{ $t("client") }} / {{ $t("contract") }} :&nbsp;</span>
                <router-link to="#">{{ request.beneficiary.client_contract.client }}</router-link
                >/
                <router-link to="#">{{ request.beneficiary.client_contract.contract }}</router-link>
              </v-card-text>
            </v-card>
          </v-flex>
          <!--<v-flex xs12 md12 sm12 xl12 lg12 pt-4 v-if="request.communityContribution.status">
            <v-card light color="white">
              <v-card light color="white pb-2 pr-4">
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{ $t("Community contribution progress") }}</h3>
                  </div>
                </v-card-title>
                <v-divider></v-divider>
                <v-layout class="mb-1 ml--1 mr-4">
                  <v-flex xs2 md3 sm3 lg2 xl2 pl-0 class="green--text font-weight-bold">
                    <v-icon class="progress-arrow" :class="{ 'green--text': request.communityContribution.status.dev }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("Dev") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.reversed }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("Reversed") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.integrated }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("Integrated") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.published }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("published") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.rejected }"
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
export default {
  name: "app",
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
      privateComment: "",
      panel: [true, true],
      comments: [],
      newStatus: "",
      currentStatus: "",
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
      assignee: []
    };
  },
  components: {
    VueEditor,
    Editor,
    VUpload
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
  computed: {
    ...mapGetters({
      email: "user/getEmail",
      avatarUrl: "user/getAvatarUrl",
      displayName: "user/getDisplayName"
    }),

    ticketStatusId() {
      if (this.ticket.status) {
        switch (this.ticket.status.toLowerCase()) {
          case "new":
            return 0;
            break;
          case "supported":
            return 1;
            break;
          case "bypassed":
            return 2;
            break;
          case "resolved":
            return 3;
            break;
          case "closed":
            return 4;
            break;
        }
      } else {
        return 0;
      }
    }
  },
  created() {
    if (this.$route.params.id.length > 6) {
      this.$http.getTicketById(this.$route.params.id).then(response => {
        this.ticket = Object.assign({}, response.data);
        this.request = Object.assign({}, response.data);
        this.setRequestData(Object.assign({}, response.data));
      });
    }

    this.$http.listUsers().then(response => {
      this.assignee = response.data;
    });
    this.$store.dispatch("sidebar/setSidebarComponent", "issue-detail-side-bar");
    this.apiUrl = ApplicationSettings.VUE_APP_OPENPAAS_URL;
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  },
  methods: {
    setRequestData(request) {
      this.currentStatus = request.status;
      this.request.statusId = 1;
      this.request.files = [];
      this.request.lastUpdate = new Date(request.timestamps.updatedAt).toDateString();
      this.request.ticketDate = new Date(request.timestamps.createdAt).toDateString();
      this.request.subject = request.description;
      this.request.inCharge = false;
      if (request.logs && request.logs.length) {
        this.request.responsible = request.logs[request.logs.length - 1].assignedTo;
        let inChargeList = request.logs.filter(log => {
          let assignedTo = log.assignedTo;
          if (assignedTo.type && assignedTo.type != "beneficiary") {
            return true;
          } else {
            return false;
          }
        });
        if (inChargeList.length) {
          this.request.inCharge = inChargeList[inChargeList.length - 1].assignedTo;
        }
      } else {
        this.request.responsible = {};
      }

      this.comments = request.comments;
      this.panel = request.comments.map(() => true);
      this.request.linkedTickets = request.relatedRequests;
      if (this.request.author && this.request.author._id) {
        if (request.author.displayName) {
          this.request.ticketAuthor = request.author.displayName;
        } else {
          this.request.ticketAuthor = request.author.name;
        }
      } else {
        this.request.ticketAuthor = this.$store.getters["user/getDisplayName"];
      }
      if (request.author && request.author._id) {
        this.request.beneficiary = request.author;
      } else {
        this.request.beneficiary = this.$store.state.user.user;
      }
      this.request.beneficiary.client_contract = {
        client: request.contract.client,
        contract: request.contract.name
      };

      if (request.contract.Engagements) {
        let engagements = [];
        if (request.software.critical == "critical") {
          engagements = [...request.contract.Engagements.critical.engagements];
        } else if (request.software.critical == "sensible") {
          engagements = [...request.contract.Engagements.sensible.engagements];
        } else if (request.software.critical == "standard") {
          engagements = [...request.contract.Engagements.standard.engagements];
        }

        let currentEngagements = engagements.filter(
          engagement => engagement.severity == request.severity && engagement.request == request.type
        );
        if (currentEngagements.length) {
          let engagement = currentEngagements[0];
          this.supportedDuration = this.parseEngagementDuration(engagement.supported);
          this.bypassedDuration = this.parseEngagementDuration(engagement.bypassed);
          this.resolvedDuration = this.parseEngagementDuration(engagement.fix);
        }
      }
      this.request.communityContribution = {};
      this.calculateCNS();
    },
    parseEngagementDuration(durationString, workHours = 9) {
      let duration = 0;
      let days = durationString.match(/(\d+)\s*(J|D|j|d)/);
      let hours = durationString.match(/(\d+)\s*(H|h)/);
      if (hours) {
        duration += parseInt(hours[1]);
      }
      if (days) {
        duration += days[1] * workHours;
      }
      return duration;
    },
    percentage(partialValue, totalValue) {
      let value = (100 * partialValue) / totalValue;
      if (value < 100) {
        return value;
      }
      return 100;
    },
    getEngagementColor(currentValue, totalValue) {
      if (this.percentage(currentValue, totalValue) < 100) {
        return "success";
      }
      return "error";
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
        body: this.comment,
        date: new Date().toDateString(),
        name: this.displayName,
        authorid: this.$store.state.user.user._id,
        image: this.avatarUrl,
        attachment: fileId,
        attachedFile: fileName
      });
      this.ticket.status = this.newStatus;
      if (this.ticket.logs && this.ticket.logs.length) {
        let previousLog = this.ticket.logs[this.ticket.logs.length - 1];
        if (
          previousLog.assignedTo &&
          previousLog.assignedTo.type == "beneficiary" &&
          this.newResponsible.type == "beneficiary"
        ) {
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
          this.panel.push(true);
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },
    calculateCNS() {
      let counter = 0;
      let workingInterval = {
        start: 9,
        end: 18
      };
      let startDate = new Date(this.ticket.timestamps.createdAt);
      let currentDate = new Date();
      let criticalityLevel = this.ticket.software.critical;
      if (criticalityLevel == "critical") {
        workingInterval = this.ticket.contract.Engagements.critical.schedule;
      } else if (criticalityLevel == "sensible") {
        workingInterval = this.ticket.contract.Engagements.sensible.schedule;
      } else if (criticalityLevel == "standard") {
        workingInterval = this.ticket.contract.Engagements.standard.schedule;
      }
      let noStop = false;
      if (workingInterval) {
        noStop = workingInterval.end == "-" || workingInterval.start == "7d/7d";
      } else {
        workingInterval = {
          start: 9,
          end: 18
        };
      }

      if (this.ticket.status == "new") {
        let endDate = Date.now();
        if (noStop) {
          this.cnsSupported = this.HoursBetween(startDate, currentDate).toPrecision(3);
        } else {
          let weekendDayCount = this.calculateWeekendDays(startDate, new Date());
          let holidaysCount = this.holidaysBetween(startDate, currentDate);
          let startsDate = new Date(this.ticket.timestamps.createdAt);

          let minutesCount = this.calculateWorkingMinutes(
            startsDate,
            new Date(),
            workingInterval.start,
            workingInterval.end
          );
          let hoursCount = minutesCount / 60;
          hoursCount = hoursCount - holidaysCount * (18 - 9);
          this.cnsSupported = hoursCount.toPrecision(3);
        }
      }

      // Calculate time spent between creation and supported status.
      let supportedActions = this.ticket.logs.filter(log => log.action.toLowerCase() == "supported");
      if (supportedActions.length) {
        let firstSupportedAction = supportedActions[0];
        let supportedMinutesCount = 0;
        if (noStop) {
          supportedMinutesCount = this.HoursBetween(startDate, new Date(firstSupportedAction.date)) * 60;
        } else {
          supportedMinutesCount = this.calculateWorkingMinutes(
            startDate,
            new Date(firstSupportedAction.date),
            workingInterval.start,
            workingInterval.end
          );
          supportedMinutesCount =
            supportedMinutesCount -
            this.holidaysBetween(startDate, new Date(firstSupportedAction.date)) *
              (workingInterval.end - workingInterval.start) *
              60;
          supportedMinutesCount =
            supportedMinutesCount -
            this.calculateTimeSuspended(this.ticket.logs, "new", workingInterval.start, workingInterval.end);
        }
        this.cnsSupported = (supportedMinutesCount / 60.0).toFixed(2);

        // Calculate time spent between supported and bypassed
        let bypassedActions = this.ticket.logs.filter(log => log.action.toLowerCase() == "bypassed");
        if (bypassedActions.length) {
          let firstBypassedAction = bypassedActions[0];
          let bypassedMinutes = 0;
          if (noStop) {
            bypassedMinutes =
              this.HoursBetween(new Date(firstSupportedAction.date), new Date(firstBypassedAction.date)) * 60;
          } else {
            bypassedMinutes = this.calculateWorkingMinutes(
              new Date(firstSupportedAction.date),
              new Date(firstBypassedAction.date),
              workingInterval.start,
              workingInterval.end
            );
            bypassedMinutes =
              bypassedMinutes -
              this.holidaysBetween(new Date(firstSupportedAction.date), new Date(firstBypassedAction.date)) *
                (workingInterval.end - workingInterval.start) *
                60;
            bypassedMinutes =
              bypassedMinutes -
              this.calculateTimeSuspended(this.ticket.logs, "supported", workingInterval.start, workingInterval.end);
          }
          this.cnsBypassed = (bypassedMinutes / 60).toFixed(2);

          let resolvedActions = this.ticket.logs.filter(log => log.action.toLowerCase() == "resolved");
          if (resolvedActions.length) {
            let firstResolvedAction = resolvedActions[0];
            let resolvedMinutes = 0;
            if (noStop) {
              resolvedMinutes =
                this.HoursBetween(new Date(firstBypassedAction.date), new Date(firstResolvedAction.date)) * 60;
            } else {
              resolvedMinutes = this.calculateWorkingMinutes(
                new Date(firstBypassedAction.date),
                new Date(firstResolvedAction.date),
                workingInterval.start,
                workingInterval.end
              );
              resolvedMinutes =
                resolvedMinutes -
                this.holidaysBetween(new Date(firstBypassedAction.date), new Date(firstResolvedAction.date)) *
                  (workingInterval.end - workingInterval.start) *
                  60;
              resolvedMinutes =
                resolvedMinutes -
                this.calculateTimeSuspended(this.ticket.logs, "bypassed", workingInterval.start, workingInterval.end);
            }
            this.cnsResolved = (resolvedMinutes / 60).toFixed(2);
          } else {
            let resolvedMinutes = this.calculateWorkingMinutes(
              new Date(firstBypassedAction.date),
              new Date(),
              workingInterval.start,
              workingInterval.end
            );
            resolvedMinutes =
              resolvedMinutes -
              this.calculateTimeSuspended(this.ticket.logs, "bypassed", workingInterval.start, workingInterval.end);
            this.cnsResolved = (resolvedMinutes / 60).toFixed(2);
          }
        } else {
          let bypassedMinutes = this.calculateWorkingMinutes(
            new Date(firstSupportedAction.date),
            new Date(),
            workingInterval.start,
            workingInterval.end
          );
          bypassedMinutes =
            bypassedMinutes -
            this.calculateTimeSuspended(this.ticket.logs, "supported", workingInterval.start, workingInterval.end);
          this.cnsBypassed = (bypassedMinutes / 60).toFixed(2);
        }
      } else {
        let holidaysCount = this.holidaysBetween(startDate, currentDate);
        let startsDate = new Date(this.ticket.timestamps.createdAt);

        let minutesCount = this.calculateWorkingMinutes(
          startsDate,
          new Date(),
          workingInterval.start,
          workingInterval.end
        );
        let hoursCount = minutesCount / 60;
        hoursCount = hoursCount - holidaysCount * (18 - 9);
        this.cnsSupported = hoursCount.toFixed(2);
      }
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

    calculateWorkingMinutes(startDate, endDate, startingHour, endHour) {
      let minutes = 0;
      while (startDate.getTime() < endDate.getTime()) {
        if (startDate.getDay() != 0 && startDate.getDay() != 6) {
          if (startDate.getHours() >= startingHour && startDate.getHours() < endHour) {
            minutes++;
          }
        }
        startDate.setMinutes(startDate.getMinutes() + 1);
      }

      return minutes;
    },

    calculateTimeSuspended(logs, actionType, startingHour, endHour) {
      let suspendedTime = 0;
      let actions = logs.filter(log => log.action.toLowerCase() == actionType);
      let suspendActions = actions.filter(log => {
        let assignedTo = log.assignedTo;
        if (assignedTo.type && assignedTo.type == "beneficiary") {
          return true;
        } else {
          return false;
        }
      });
      let resumeAction = {};
      for (var i = 0; i < suspendActions.length; i++) {
        for (var j = 0; j < actions.length; j++) {
          if (new Date(actions[j].date).getTime() > new Date(suspendActions[i].date).getTime()) {
            if (actions[j].assignedTo && actions[j].assignedTo.type !== "beneficiary") {
              suspendedTime += this.calculateWorkingMinutes(
                new Date(suspendActions[i].date),
                new Date(actions[j].date),
                startingHour,
                endHour
              );
            }
          }
        }
      }

      return suspendedTime;
    },
    HoursBetween(start, end) {
      let diff = end.getTime() - start.getTime();
      let daysCount = diff / (1000 * 60 * 60 * 24);
      let hoursCount = daysCount * 24;
      return hoursCount.toFixed(2);
    },

    holidaysBetween(from, to) {
      let allHolidays = [];
      let startYear = from.getYear() + 1900;
      let endYear = to.getYear() + 1900;
      allHolidays = this.getHolidays(startYear);
      if (startYear !== endYear) {
        allHolidays.concat(this.getHolidays(endYear));
      }

      let holidaysDates = allHolidays.map(date => new Date(date));
      let holidays = holidaysDates.filter(date => {
        if (date.getTime() <= to.getTime() && date.getTime() >= from.getTime()) {
          if (date.getDay() == 6 || date.getDay() == 0) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      });

      return holidays.length;
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

    getHolidays(year) {
      let holidays = [];
      holidays = require("@/assets/data/holidays.json");
      if (!holidays.length) {
        holidays = this.$http.listHolidays();
      }

      return holidays;
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
    }
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
