<template>
  <v-container grid-list-md>
    <v-card-text>
      <a href="#" disabled class="text-lg-left action-links">
        <v-icon class="mr-2">bug_report</v-icon>
        {{ $t("REQUEST VIEW") }}
      </a>
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
                  >{{ $t("Supported") }}</v-stepper-step>
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
                  >{{ $t("Bypassed") }}</v-stepper-step>
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
                  >{{ $t("Resolved") }}</v-stepper-step>
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
                  <h3 class="headline mb-0">#{{ request.ticketNumber }} - {{ request.ticketTitle }}</h3>
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
              {{ request.gravity }}
            </v-flex>

            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("severity") }} :</strong>
              {{ request.gravity }}
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
              {{ request.responsible.name }}
            </v-flex>
            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Last update") }} :</strong>
              {{ request.lastUpdate }}
            </v-flex>
            <v-flex xs3 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Software") }} :</strong>
              {{ request.software }}
            </v-flex>
            <v-flex xs4 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("Version") }} :</strong>
              {{ request.softwareVersion }}
            </v-flex>
            <v-flex xs5 md4 sm3 lg4 xl4 class="pt-0">
              <strong>{{ $t("OS") }} :</strong>
              {{ request.softwareOs }}
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
                  <div class="subject-text" v-html="request.subject"></div>
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
                          <a :href="`${apiUrl}/api/files/${file.id}`" target="_blank">
                            {{
                            file.name
                            }}
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
                          <span
                            v-if="link.type == 'duplicate'"
                          >{{ $t("is a copy of ticket") }}&nbsp;</span>
                          <span v-else-if="link.type == 'closes'">{{ $t("closes ticket") }}&nbsp;</span>
                          <router-link
                            :to="{ name: 'Request', params: { id: link.id } }"
                          >{{ link.request }}</router-link>
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
                                <router-link
                                  :to="`${apiUrl}/api/files/${comment.attachment}`"
                                  target="_blank"
                                >
                                  {{
                                  comment.attachedFile
                                  }}
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
                                <a
                                  :href="`${apiUrl}/api/files/${comment.attachment}`"
                                  target="_blank"
                                >
                                  {{
                                  comment.attachedFile
                                  }}
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
                    <v-btn-toggle v-model="selectedEditor">
                      <v-btn flat value="wysiwyg">{{ $t("wysiwyg Editor") }}</v-btn>
                      <v-btn flat value="markdown">{{ $t("Markdown Editor") }}</v-btn>
                    </v-btn-toggle>
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
                            :items="assigneeList"
                            v-model="newResponsible"
                            :label="$t('Assigned to')"
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
                        <v-btn
                          color="info"
                          class="custom-comment-btn"
                          @click="addComment"
                          :disabled="!commentBtn"
                        >{{ $t("add comment") }}</v-btn>
                      </v-flex>
                      <v-flex xs4 md4 sm4 lg4 xl4></v-flex>
                    </v-layout>
                  </v-form>
                </v-card>
              </v-tab-item>
              <v-tab-item value="satisfaction">
                <v-card flat>
                  <v-card-text>
                    {{
                    $t("the satisfaction survey will be available once the ticket is closed")
                    }}
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
            <v-card light color="white" class="px-4 pb-3" v-if="request.status == 'new'">
              <v-card-title primary-title>
                <h3 class="headline mb-0">{{ $t("Service deadlines") }}</h3>
              </v-card-title>
              <v-divider></v-divider>
              {{ $t("Supported") }}
              <v-layout row wrap>
                <v-flex xs9 md9 sm9 xl9 lg9 class="px-1 pt-0 pb-0 text-xs-center">
                  <v-progress-linear
                    color="success"
                    height="18"
                    value="0"
                    class="mt-0 white--text font-weight-bold"
                  >0 HO</v-progress-linear>
                </v-flex>
                <v-flex xs2 md2 sm2 lg2 xl2 px-1 pt-0 pb-0>1 HO</v-flex>
                <v-flex xs1 md1 sm1 lg1 xl1 px-1 pt-0 pb-0>
                  <v-icon color="#249CC7">access_time</v-icon>
                </v-flex>
              </v-layout>
              {{ $t("Bypass") }}
              <v-layout row wrap>
                <v-flex xs9 md9 sm9 xl9 lg9 class="px-1 pt-0 pb-0 text-xs-center">
                  <v-progress-linear
                    color="#CFCFCF"
                    height="18"
                    value="0"
                    class="mt-0 white--text font-weight-bold"
                  ></v-progress-linear>
                </v-flex>
                <v-flex xs2 md2 sm2 lg2 xl2 px-1 pt-0 pb-0></v-flex>
                <v-flex xs1 md1 sm1 lg1 xl1 px-1 pt-0 pb-0></v-flex>
              </v-layout>
              {{ $t("Solution") }}
              <v-layout row wrap>
                <v-flex xs9 md9 sm9 xl9 lg9 class="px-1 pt-0 pb-0 text-xs-center">
                  <v-progress-linear
                    color="#CFCFCF"
                    height="18"
                    value="0"
                    class="mt-0 white--text font-weight-bold"
                  ></v-progress-linear>
                </v-flex>
                <v-flex xs2 md2 sm2 lg2 xl2 px-1 pt-0 pb-0></v-flex>
                <v-flex xs1 md1 sm1 lg1 xl1 px-1 pt-0 pb-0></v-flex>
              </v-layout>
            </v-card>
            <v-card light color="white" class="px-4 pb-3" v-else>
              <v-card-title primary-title>
                <h3 class="headline mb-0">{{ $t("Service deadlines") }}</h3>
              </v-card-title>
              <v-divider></v-divider>
              {{ $t("Supported") }}
              <v-layout row wrap>
                <v-flex xs9 md9 sm9 xl9 lg9 class="px-1 pt-0 pb-0 text-xs-center">
                  <v-progress-linear
                    color="success"
                    height="18"
                    value="100"
                    class="mt-0 white--text font-weight-bold"
                  >0 HO</v-progress-linear>
                </v-flex>
                <v-flex xs2 md2 sm2 lg2 xl2 px-1 pt-0 pb-0>2 H</v-flex>
                <v-flex xs1 md1 sm1 lg1 xl1 px-1 pt-0 pb-0>
                  <v-icon color="#249CC7">access_time</v-icon>
                </v-flex>
              </v-layout>
              {{ $t("Bypass") }}
              <v-layout row wrap>
                <v-flex xs9 md9 sm9 xl9 lg9 class="px-1 pt-0 pb-0 text-xs-center">
                  <v-progress-linear
                    color="#CFCFCF"
                    height="18"
                    value="40"
                    class="mt-0 white--text font-weight-bold"
                  >0</v-progress-linear>
                </v-flex>
                <v-flex xs2 md2 sm2 lg2 xl2 px-1 pt-0 pb-0></v-flex>
              </v-layout>
              {{ $t("Solution") }}
              <v-layout row wrap>
                <v-flex xs9 md9 sm9 xl9 lg9 class="px-1 pt-0 pb-0 text-xs-center">
                  <v-progress-linear
                    color="#CFCFCF"
                    height="18"
                    value="60"
                    class="mt-0 white--text font-weight-bold"
                  >0</v-progress-linear>
                </v-flex>
                <v-flex xs2 md2 sm2 lg2 xl2 px-1 pt-0 pb-0></v-flex>
                <v-flex xs1 md1 sm1 lg1 xl1 px-1 pt-0 pb-0></v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xs12 md12 sm12 xl12 lg12 pt-4 align-center justify-center>
            <h4
              class="text-uppercase text-md-center text-xs-center blue white--text pt-2 pb-1"
            >{{ $t("interlocutor in charge of the request") }}</h4>
            <v-card class="pt-2 nobottomshadow" v-if="request.responsible.name">
              <v-icon large color="blue" class="arrow-down pr-5 pt-1">play_arrow</v-icon>
              <br />
              <v-layout row wrap>
                <v-flex xs3 md2 sm4 lg4 xl4></v-flex>
                <v-flex xs8 md8 sm6 lg8 xl6>
                  <v-avatar size="100%" class="pl-1 avatar-width">
                    <v-img :src="avatarUrl ? avatarUrl : ''"></v-img>
                  </v-avatar>
                </v-flex>
              </v-layout>

              <v-card-text>
                <strong>{{ $t("Contact") }} :</strong>
                {{ request.responsible.name }}
                <br />
                <strong>{{ $t("Phone") }} :</strong>
                {{ request.responsible.phone }}
                <br />
                <strong>{{ $t("eMail") }} :</strong>
                {{ request.responsible.email }}
              </v-card-text>
            </v-card>
            <h4
              class="text-uppercase text-md-center text-xs-center blue white--text pt-2 pb-1"
            >{{ $t("Beneficiary") }}</h4>
            <v-card class="pt-2">
              <v-icon large class="arrow-down pr-5 pt-1 blue-color">play_arrow</v-icon>
              <v-layout row wrap>
                <v-flex xs2 md4 xl4 sm4 lg2 pl-0></v-flex>
                <v-flex xs10 md5 sm5 xl5 lg10 pl-3>
                  <v-avatar
                    size="150"
                    title="false"
                    class="avatar-width"
                    v-if="request.beneficiary.image.length > 1"
                  >
                    <v-img :src="request.beneficiary.image"></v-img>
                  </v-avatar>
                </v-flex>
              </v-layout>

              <v-card-text>
                <strong>{{ $t("Contact") }} :</strong>
                {{ request.beneficiary.contact }}
                <br />
                <strong>{{ $t("Phone") }} :</strong>
                {{ request.beneficiary.phone }}
                <br />
                <span class="body-2">{{ $t("client") }} / {{ $t("contract") }} :&nbsp;</span>
                <router-link to="#">{{ request.beneficiary.client_contract.client }}</router-link>/
                <router-link to="#">{{ request.beneficiary.client_contract.contract }}</router-link>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 md12 sm12 xl12 lg12 pt-4 v-if="request.communityContribution.status">
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
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.dev }"
                    >label_important</v-icon>
                    <small>{{ $t("Dev") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.reversed }"
                    >label_important</v-icon>
                    <small>{{ $t("Reversed") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.integrated }"
                    >label_important</v-icon>
                    <small>{{ $t("Integrated") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.published }"
                    >label_important</v-icon>
                    <small>{{ $t("published") }}</small>
                  </v-flex>
                  <v-flex xs2 md3 sm3 lg2 xl2 ml-3 pl-0>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.rejected }"
                    >label_important</v-icon>
                    <small>{{ $t("Rejected") }}</small>
                  </v-flex>
                </v-layout>
                <h3>{{ $t("Community contribution form") }}:</h3>
                <a :href="request.communityContribution.communityIssueLink">
                  {{
                  request.communityContribution.communityIssueLink
                  }}
                </a>
              </v-card>
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
        comments: {},
        statusId: 2
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
      assigneeList: ["Dany QUAVAT", "Person 2", "Person 3"],
      text: ""
    };
  },
  components: {
    VueEditor,
    Editor,
    VUpload
  },
  mounted() {
    var progressBars = Array.prototype.slice.call(
      document.getElementsByClassName("v-progress-linear")
    );
    for (let index = 0; index < progressBars.length; index++) {
      var element = progressBars[index];
      var value = element.getElementsByClassName(
        "v-progress-linear__content"
      )[0].innerHTML;
      var newValueRegion = element.getElementsByClassName(
        "v-progress-linear__bar__determinate"
      );
      newValueRegion[0].innerHTML = value;
      element.getElementsByClassName(
        "v-progress-linear__content"
      )[0].innerHTML = "";
    }
  },
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
    //this.comments = require("@/assets/data/comments.json");
    //this.request = request;
    if (this.$route.params.id.length > 6) {
      this.$http.getTicketById(this.$route.params.id).then(response => {
        this.ticket = Object.assign({}, response.data);
        this.request = Object.assign({}, response.data);
        this.setRequestData(Object.assign({}, response.data));
        console.log(this.ticket);
        console.log(this.request);
      });
    }
    this.$store.dispatch(
      "sidebar/setSidebarComponent",
      "issue-detail-side-bar"
    );
    this.apiUrl = ApplicationSettings.VUE_APP_OPENPAAS_URL;
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  },
  methods: {
    setRequestData(request) {
      this.currentStatus = request.status;
      this.request.ticketTitle = request.title;
      this.request.ticketNumber = request._id;
      if (request.software.name) {
        this.request.software = request.software.name;
        this.request.softwareOs = request.software.os;
        this.request.softwareVersion = request.software.version;
      }
      this.request.statusId = 1;
      this.request.files = [];
      this.request.lastUpdate = "";
      this.request.ticketDate = new Date(
        request.timestamps.creation
      ).toDateString();
      this.request.subject = request.description;
      this.request.responsible = {};
      this.request.ticketAuthor = "";
      this.comments = request.comments;
      this.panel = request.comments.map(() => true);
      this.request.linkedTickets = request.relatedRequests;
      this.request.ticketAuthor = this.$store.getters["user/getDisplayName"];
      this.request.serviceLevel = {};
      this.request.beneficiary = {
        image: "",
        contact: request.contract.humanResources.beneficiaries[0].name,
        phone: "",
        client_contract: {
          client: request.contract.client,
          contract: request.contract.name
        }
      };
      this.request.communityContribution = {};
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
      if (this.currentStatus != this.newStatus) {
        this.ticket.status = this.newStatus;
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
