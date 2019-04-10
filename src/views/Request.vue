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
          <v-layout justify-center row fill-height wrap ml-3>
            <v-flex xs4>
              <v-card-text class="px-0 information">
                <strong>{{ $t("Gravity") }} :</strong>
                {{ request.gravity }}
              </v-card-text>
              <v-card-text class="px-0">
                <strong>{{ $t("Software") }} :</strong>
                {{ request.software }}
              </v-card-text>
              <v-card-text class="px-0 information">
                <strong>{{ $t("Last update") }} :</strong>
                {{ request.lastUpdate }}
              </v-card-text>
            </v-flex>
            <v-flex xs4>
              <v-card-text class="px-0 information">
                <div>
                  <strong>{{ $t("Ticket #") }} :</strong>
                  {{ request.ticketNumber }}
                </div>
              </v-card-text>
              <v-card-text class="px-0">
                <strong>{{ $t("Created at") }} :</strong>
                {{ request.ticketDate }}
              </v-card-text>
            </v-flex>
            <v-flex xs4>
              <v-btn color="info" v-if="$auth.check('admin')">{{ $t("TRANSFER TICKET") }}</v-btn>
            </v-flex>
          </v-layout>
          <v-divider class="mx-3"></v-divider>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ request.ticketTitle }}</h3>
              </div>
            </v-card-title>
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
                  : {{ request.attachedFile }}
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text>
              <v-layout>
                <v-flex xs1>
                  <v-icon>insert_link</v-icon>
                </v-flex>
                <v-flex xs11>
                  <b>{{ $t("Related requests") }}</b> :
                  <a href="#" v-for="link in request.linkedTickets" :key="link" class="pr-2">{{ link }}</a>
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
                    <v-expansion-panel-content v-for="comment in comments" :key="comment.id">
                      <template v-slot:header>
                        <div class="font-weight-bold">
                          <span class="subheading">{{ comment.name }}</span>
                          {{ comment.date }}
                        </div>
                      </template>
                      <v-card class="ml-4">
                        <v-card-text>{{ comment.body }}</v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-divider></v-divider>
                  <v-form>
                    <v-input prepend-icon="subject" class="pt-2">
                      <vue-editor v-model="comment"></vue-editor>
                    </v-input>
                    <markdown-editor
                      :options="options"
                      v-model="comment"
                      toolbar="bold italic heading | image link | numlist bullist code quote | preview fullscreen"
                      name="html"
                    ></markdown-editor>
                    <v-btn color="info">{{ $t("add comment") }}</v-btn>
                  </v-form>
                </v-card>
              </v-tab-item>
              <v-tab-item value="satisfaction">
                <v-card flat>
                  <v-card-text>{{
                    $t("the satisfaction survey will be available once the ticket is closed")
                  }}</v-card-text>
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
                <h3 class="headline mb-0">{{ $t("Beneficiary") }}</h3></v-card-title
              >
              <v-divider></v-divider>
              <v-card-text>
                <span class="body-2"> {{ $t("contact") }} :</span> {{ request.beneficiary.contact }} <br />
                <span class="body-2"> {{ $t("Phone") }} :</span> {{ request.beneficiary.phone }} <br />
                <span class="body-2"> {{ $t("client") }} / {{ $t("contract") }} : </span>
                <router-link to="#">{{ request.beneficiary.client_contract.client }}</router-link> /
                <router-link to="#">{{ request.beneficiary.client_contract.contract }}</router-link>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card light color="white" class="px-4 pb-3">
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{ $t("Ticket status") }}</h3>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-layout>
                <v-flex xs8>
                  <v-layout class="mb-1">
                    <v-flex xs4 class="green--text font-weight-bold">
                      <v-icon class="progress-arrow" :class="{ 'green--text': request.requestStatus.open }"
                        >label_important</v-icon
                      >
                      <small>{{ $t("Open") }}</small>
                    </v-flex>
                    <v-flex xs4 class="green--text font-weight-bold">
                      <v-icon class="progress-arrow" :class="{ 'green--text': request.requestStatus.progress }"
                        >label_important</v-icon
                      >
                      <small>{{ $t("Processing") }}</small>
                    </v-flex>
                    <v-flex xs4>
                      <v-icon class="progress-arrow" :class="{ 'green--text': request.requestStatus.closed }"
                        >label_important</v-icon
                      >
                      <small>{{ $t("Closed") }}</small>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-card-text class="px-0 information">
                <strong>{{ $t("Next step") }} :</strong>
                {{ request.requestStatus.nextStep }}
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card light color="white">
              <v-card-title primary-title class="px-4">
                <div>
                  <h3 class="headline mb-0 mx-4">{{ $t("Service level") }}</h3>
                </div>
              </v-card-title>
              <v-divider class="mx-4"></v-divider>
              <v-list ml-0 mr-0 mt-0>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2 red--text">{{ request.serviceLevel.level }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile class="blue-grey lighten-5">
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2 text-uppercase">{{ $t("recall") }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="grey--text px-2">{{ request.serviceLevel.recall }}</v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2 text-uppercase">{{ $t("info request answer") }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="grey--text px-2">
                    {{ request.serviceLevel.infoResponse }}
                  </v-list-tile-action>
                </v-list-tile>
                <v-list-tile class="blue-grey lighten-5">
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2 text-uppercase">{{ $t("circumvention") }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="grey--text px-2">{{ request.serviceLevel.bypass }}</v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2 text-uppercase">{{ $t("final solution") }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="grey--text px-2">{{
                    request.serviceLevel.finalSolution
                  }}</v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card light color="white px-4 pt-2">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-badge color="green" right bottom overlap v-if="request.requestTime.recall.done">
                    <v-icon slot="badge" dark small>done</v-icon>
                    <v-icon large>access_time</v-icon>
                    <span></span>
                  </v-badge>
                  <v-icon large v-else>access_time</v-icon>
                  <strong class="pl-3">{{ $t("Recall") }} :</strong>
                  {{ request.requestTime.recall.value }}
                </v-flex>
                <v-flex xs12>
                  <v-badge color="green" right bottom overlap v-if="request.requestTime.bypass.done">
                    <v-icon slot="badge" dark small>done</v-icon>
                    <v-icon large>access_time</v-icon>
                    <span></span>
                  </v-badge>
                  <v-icon large v-else>access_time</v-icon>
                  <strong class="pl-3">{{ $t("Bypass") }} :</strong>
                  {{ request.requestTime.bypass.value }}
                </v-flex>
                <v-flex xs12>
                  <v-badge color="green" right bottom overlap v-if="request.requestTime.finalSolution.done">
                    <v-icon slot="badge" dark small>done</v-icon>
                    <v-icon large>access_time</v-icon>
                    <span></span>
                  </v-badge>
                  <v-icon large v-else>access_time</v-icon>
                  <strong class="pl-3">{{ $t("Final solution") }} :</strong>
                  {{ request.requestTime.finalSolution.value }}
                </v-flex>
              </v-layout>
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
                <a :href="request.communityContribution.communityIssueLink">{{
                  request.communityContribution.communityIssueLink
                }}</a>
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
      }
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
      email: "user/getEmail"
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
<style scoped type="text/css">
.elevation-1 {
  width: 100% !important;
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
.flex.xs8.pr-5 {
  padding-right: 10px !important;
}
.container.grid-list-md .layout .flex {
  padding: 15px;
}
.quillWrapper,
.ql-editor {
  width: 100%;
}
</style>
