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
      <v-flex xs8 pr-5>
        <v-card light color="white">
          <v-layout row wrap>
            <v-flex xs1 class="mt-4">
              <strong class="pt-4">{{ $t("Status") }} :</strong>
            </v-flex>
            <v-flex xs11>
              <v-stepper non-linear>
                <v-stepper-header>
                  <v-stepper-step step="3" complete color="success">{{ $t("New") }}</v-stepper-step>

                  <v-divider color="success"></v-divider>

                  <v-stepper-step step="4" complete color="success">{{ $t("In progress") }}</v-stepper-step>

                  <v-divider color="success"></v-divider>

                  <v-stepper-step step="4" complete color="success">{{ $t("Bypass") }}</v-stepper-step>

                  <v-divider color="primary"></v-divider>

                  <v-stepper-step step="5" color="primary" complete complete-icon="access_time">{{
                    $t("Solution")
                  }}</v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step step>{{ $t("Closing") }}</v-stepper-step>
                </v-stepper-header>
              </v-stepper>
            </v-flex>
          </v-layout>
          <v-divider />
          <v-layout row wrap>
            <v-flex xs10 class="pt-0 pb-0">
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">#{{ request.ticketNumber }} - {{ request.ticketTitle }}</h3>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs2 class="pt-0 pb-0">
              <div class="text-xs-right grey--text pt-3 justify-end">
                <v-btn color="primary" fab small dark :to="{ name: '#', params: { id: 15, section: 'hr' } }">
                  <v-icon>edit</v-icon>
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
          <v-divider />
          <v-layout justify-center row fill-height wrap ml-3>
            <v-flex xs4 class="pt-0 pb-1">
              <strong>{{ $t("Type") }} :</strong>
              {{ request.gravity }}
            </v-flex>

            <v-flex xs4 class="pt-0 pb-1">
              <strong>{{ $t("severity") }} :</strong>
              {{ request.gravity }}
            </v-flex>
            <v-flex xs4 class="pt-0 pb-1">
              <strong>{{ $t("Created at") }} :</strong>
              {{ request.ticketDate }}
            </v-flex>
            <v-flex xs4 class="pt-0 pb-1">
              <strong>{{ $t("Created by") }} :</strong>
              {{ request.ticketAuthor }}
            </v-flex>

            <v-flex xs4 class="pt-0 pb-1">
              <strong>{{ $t("Assigned to") }} :</strong>
              {{ request.responsible.name }}
            </v-flex>
            <v-flex xs4 class="pt-0 pb-1">
              <strong>{{ $t("Last update") }} :</strong>
              {{ request.lastUpdate }}
            </v-flex>
            <v-flex xs4 class="pt-0 pb-1">
              <strong>{{ $t("Software") }} :</strong>
              {{ request.software }}
            </v-flex>
            <v-flex xs4 class="pt-0 pb-1">
              <strong>{{ $t("Version") }} :</strong>
              {{ request.softwareVersion }}
            </v-flex>
            <v-flex xs4 class="pt-0 pb-1">
              <strong>{{ $t("OS") }} :</strong>
              {{ request.softwareOs }}
            </v-flex>
          </v-layout>
          <v-divider class="mx-3"></v-divider>
          <v-card>
            <v-card-text>
              <v-layout>
                <v-flex xs1>
                  <v-icon>subject</v-icon>
                </v-flex>
                <v-flex xs11 class="pt-0 pl-0">
                  <div class="subject-text">{{ request.subject }}</div>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text class="pb-0">
              <v-layout>
                <v-flex xs1>
                  <v-icon>attach_file</v-icon>
                </v-flex>
                <v-flex xs11>
                  <b>{{ $t("Attachments") }}</b>
                  :
                  <router-link :to="{ name: '#' }">{{ request.attachedFile }}</router-link>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text>
              <v-layout>
                <v-flex xs1>
                  <v-icon>insert_link</v-icon>
                </v-flex>
                <v-flex xs11>
                  <v-layout row wrap>
                    <v-flex xs2>
                      <strong>{{ $t("Related requests") }} :</strong>
                    </v-flex>
                    <v-flex xs7>
                      <ul>
                        <li v-for="(link, key) in request.linkedTickets" :key="key">
                          <span v-if="link.type == 'duplicate'">{{ $t("is a copy of ticket") }}&nbsp;</span>
                          <span v-else-if="link.type == 'closes'">{{ $t("closes ticket") }}&nbsp;</span>
                          <router-link :to="{ name: 'request', params: { id: link.id } }">#{{ link.id }}</router-link>
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
                    <v-expansion-panel-content v-for="comment in comments" :key="comment.id" color="grey lighten-4">
                      <template v-slot:header>
                        <div class="font-weight-bold">
                          <span class="subheading">{{ comment.name }}</span>
                          {{ comment.date }}
                        </div>
                      </template>
                      <v-card class="ml-4">
                        <v-layout row wrap>
                          <v-flex xs2>
                            <v-avatar size="60" tile="false">
                              <v-img :src="comment.image"></v-img>
                            </v-avatar>
                          </v-flex>
                          <v-flex xs10>
                            <v-card-text>{{ comment.body }}</v-card-text>
                            <v-card-text v-if="comment.attachedFile">
                              <v-icon>attach_file</v-icon>
                              <router-link :to="{ name: '#' }">{{ comment.attachedFile }}</router-link>
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
                  </v-expansion-panel>
                  <v-divider></v-divider>
                  <v-form>
                    <v-input prepend-icon="subject" class="pt-2">
                      <vue-editor v-model="comment"></vue-editor>
                    </v-input>
                    <v-input prepend-icon="no-icon" class="pt-2">
                      <v-layout row wrap>
                        <v-flex xs3>
                          <v-select :items="statusList" :label="$t('Status')"></v-select>
                        </v-flex>
                        <v-flex xs3>
                          <v-select :items="assigneeList" :label="$t('Assigned to')"></v-select>
                        </v-flex>
                        <v-flex xs3>
                          <v-checkbox v-model="selected" color="primary" :label="$t('private comment')"></v-checkbox>
                        </v-flex>
                        <v-flex xs3>
                          <file-upload
                            prepend-icon="attach_file"
                            class="file pt-2"
                            btn-label="Attach file"
                            btn-uploading-label="Uploading file"
                          ></file-upload>
                        </v-flex>
                      </v-layout>
                    </v-input>
                    <v-layout row wrap>
                      <v-flex xs5></v-flex>
                      <v-flex xs7>
                        <v-btn color="info" class="pl-4">{{ $t("add comment") }}</v-btn>
                      </v-flex>
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
      <v-flex xs4 pt-0>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card light color="white" class="px-4 pb-3">
              <v-card-title primary-title>
                <h3 class="headline mb-0">{{ $t("Service deadlines") }}</h3>
              </v-card-title>
              <v-divider></v-divider>
              {{ $t("Supported") }}
              <v-layout row wrap>
                <v-flex xs10 class="px-1 pt-0 pb-0">
                  <v-progress-linear color="error" height="18" value="100" class="mt-0"></v-progress-linear>
                </v-flex>
                <v-flex xs1 px-1 pt-0 pb-0>1HO</v-flex>
                <v-flex xs1 px-1 pt-0 pb-0>
                  <v-icon class="error--text">close</v-icon>
                </v-flex>
              </v-layout>
              {{ $t("Bypass") }}
              <v-layout row wrap class="text-xs-center">
                <v-flex xs10 class="px-1 pt-0 pb-0">
                  <v-progress-linear color="success" height="18" value="60" class="mt-0">8HO</v-progress-linear>
                </v-flex>
                <v-flex xs1 px-1 pt-0 pb-0>1HO</v-flex>
                <v-flex xs1 px-1 pt-0 pb-0>
                  <v-icon class="success--text">check</v-icon>
                </v-flex>
              </v-layout>
              {{ $t("Solution") }}
              <v-layout row wrap>
                <v-flex xs10 class="px-1 pt-0 pb-0">
                  <v-progress-linear color="success" height="18" value="60" class="mt-0"></v-progress-linear>
                </v-flex>
                <v-flex xs1 px-1 pt-0 pb-0>1HO</v-flex>
                <v-flex xs1 px-1 pt-0 pb-0>
                  <v-icon class="success--text">check</v-icon>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xs12 align-center justify-center>
            <h4 class="text-uppercase text-md-center blue white--text pt-2 pb-1">
              {{ $t("interlocutor in charge of the request") }}
            </h4>
            <v-card class="pt-2">
              <v-icon large color="blue" class="arrow-down pr-5 pt-2">play_arrow</v-icon>
              <br />
              <v-avatar size="150">
                <v-img :src="avatarUrl"></v-img>
              </v-avatar>

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
            <h4 class="text-uppercase text-md-center blue white--text pt-2 pb-1">
              {{ $t("Beneficiary") }}
            </h4>
            <v-card class="pt-2">
              <v-icon large color="blue" class="arrow-down pr-5 pt-2">play_arrow</v-icon>
              <v-avatar size="150" tile="false">
                <v-img :src="request.beneficiary.image"></v-img>
              </v-avatar>
              <v-card-text>
                <strong>{{ $t("Contact") }} :</strong>
                {{ request.beneficiary.contact }}
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
          <v-flex xs12>
            <v-card light color="white">
              <v-card light color="white px-4 pb-2">
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">{{ $t("Community contribution progress") }}</h3>
                  </div>
                </v-card-title>
                <v-divider></v-divider>
                <v-layout class="mb-1">
                  <v-flex class="green--text font-weight-bold">
                    <v-icon class="progress-arrow" :class="{ 'green--text': request.communityContribution.status.dev }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("Dev") }}</small>
                  </v-flex>
                  <v-flex>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.reversed }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("Reversed") }}</small>
                  </v-flex>
                  <v-flex>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.integrated }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("Integrated") }}</small>
                  </v-flex>
                  <v-flex>
                    <v-icon
                      class="progress-arrow"
                      :class="{ 'green--text': request.communityContribution.status.published }"
                      >label_important</v-icon
                    >
                    <small>{{ $t("published") }}</small>
                  </v-flex>
                  <v-flex>
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
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { VueEditor } from "vue2-editor";
var request = require("@/assets/data/request.json");
export default {
  data() {
    return {
      panel: [true, true],
      comments: [],
      request: {},
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
      statusList: ["in progress", "closed", "suspended"],
      assigneeList: ["Dany QUAVAT", "Person 2", "Person 3"]
    };
  },
  components: {
    VueEditor
  },
  mounted() {
    this.$http.getTicketById(this.$route.params.id).then(response => (this.request = response.data));
  },
  computed: {
    ...mapGetters({
      email: "user/getEmail",
      avatarUrl: "user/getAvatarUrl"
    })
  },
  created() {
    this.comments = require("@/assets/data/comments.json");
    this.request = request;
    this.$store.dispatch("sidebar/setSidebarComponent", "issue-detail-side-bar");
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

.flex.xs8.pr-5 {
  padding-right: 10px !important;
}

.container.grid-list-md .layout .flex {
  padding: 15px;
}

.quillWrapper, .ql-editor {
  width: 100%;
}

.arrow-down {
  transform: rotate(90deg);
  position: absolute;
  left: 35%;
}

.v-image {
  left: 50%;
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
</style>
