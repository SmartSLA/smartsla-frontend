<template>
  <v-container grid-list-md>
    <v-card-text>
      <a href="#" disabled class="text-lg-left action-links"> <v-icon class="mr-2">bug_report</v-icon>REQUEST VIEW </a>
      <a href="#" class="action-links right"> <v-icon class="mr-2">backup</v-icon>EXPORT SHEET (CSV) </a>
      <a href="#" class="action-links mr-5 right"> <v-icon class="mr-2">print</v-icon>PRINT SHEET </a>
    </v-card-text>
    <v-layout row wrap justify-space-between>
      <v-flex xs8 pr-5>
        <v-card light color="white">
          <v-layout justify-center row fill-height wrap ml-3>
            <v-flex xs4>
              <v-card-text class="px-0 information">
                <strong>{{ $t("Gravity") }} :</strong>
                {{ gravity }}
              </v-card-text>
              <v-card-text class="px-0">
                <strong>{{ $t("Software") }} :</strong>
                {{ software }}
              </v-card-text>
            </v-flex>
            <v-flex xs4>
              <v-card-text class="px-0 information">
                <div>
                  <strong>{{ $t("Ticket #") }} :</strong>
                  {{ ticketNumber }}
                </div>
              </v-card-text>
              <v-card-text class="px-0">
                <strong>{{ $t("Created at") }} :</strong>
                {{ ticketDate }}
              </v-card-text>
            </v-flex>
            <v-flex xs4>
              <v-btn color="info">{{ $t("TRANSFER TICKET") }}</v-btn>
            </v-flex>
          </v-layout>
          <v-divider class="mx-3"></v-divider>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ ticketTitle }}</h3>
              </div>
            </v-card-title>
            <v-card-text>
              <v-layout>
                <v-flex xs1>
                  <v-icon>subject</v-icon>
                </v-flex>
                <v-flex xs11 class="pt-0 pl-0">
                  <div class="subject-text">{{ subject }}</div>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text class="pb-0">
              <v-layout>
                <v-flex xs1>
                  <v-icon>attach_file</v-icon>
                </v-flex>
                <v-flex xs11>
                  <b>{{ $t("Attachments") }}</b
                  >: {{ attachedFile }}
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
                  <a href="#" v-for="link in linkedTickets" :key="link" class="pr-2">{{ link }}</a>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-card>
            <v-tabs grow icons-and-text class="ml-3 mr-3">
              <v-tabs-slider color="primary"></v-tabs-slider>
              <v-tab href="#comment">{{ $t("comments") }}</v-tab>
              <v-tab href="#chat">{{ $t("chat history") }}</v-tab>
              <v-tab href="#satisfaction">{{ $t("satisfaction after closure") }}</v-tab>
              <v-tab-item value="comment" class="mt-1">
                <v-card flat>
                  <v-form>
                    <v-textarea solo autofocus auto-grow prepend-icon="subject" name="input-7-4" value=""></v-textarea>
                    <v-btn color="info">{{ $t("POST A NEW MESSAGE") }}</v-btn>
                  </v-form>
                </v-card>
              </v-tab-item>
              <v-tab-item value="chat">
                <v-card flat>
                  <v-card-text>chat</v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item value="satisfaction">
                <v-card flat>
                  <v-card-text>satisfaction</v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-card>
      </v-flex>
      <v-flex xs4 pt-0>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card light color="white">
              <v-card-title primary-title class="px-4">
                <div>
                  <h3 class="headline mb-0">{{ $t("Service level") }}</h3>
                </div>
              </v-card-title>
              <v-divider class="mx-4"></v-divider>
              <v-list ml-0 mr-0 mt-0>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2 red--text">Niveau standard _ incident bloquant</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile class="blue-grey lighten-5">
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2 text-uppercase">{{ $t("recall") }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="grey--text px-2">85JO</v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2 text-uppercase">{{ $t("info request answer") }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="grey--text px-2">85JO</v-list-tile-action>
                </v-list-tile>
                <v-list-tile class="blue-grey lighten-5">
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2 text-uppercase">{{ $t("circumvention") }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="grey--text px-2">85JO</v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2 text-uppercase">{{ $t("final solution") }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="grey--text px-2">85JO</v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card light color="white px-4 pt-2">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-badge color="green" right bottom overlap>
                    <v-icon slot="badge" dark small>done</v-icon>
                    <v-icon large>access_time</v-icon>
                    <span></span>
                  </v-badge>
                  <strong class="pl-3">{{ $t("Recall") }} :</strong> {{ recallTime }}
                </v-flex>
                <v-flex xs12>
                  <v-badge color="green" right bottom overlap>
                    <v-icon slot="badge" dark small>done</v-icon>
                    <v-icon large>access_time</v-icon>
                    <span></span>
                  </v-badge>
                  <strong class="pl-3">{{ $t("Bypass") }} :</strong> {{ bypassTime }}
                </v-flex>
                <v-flex xs12>
                  <v-badge color="green" right bottom overlap v-if="final">
                    <v-icon slot="badge" dark small>done</v-icon>
                    <v-icon large>access_time</v-icon>
                    <span></span>
                  </v-badge>
                  <v-icon large v-else>access_time</v-icon>
                  <strong class="pl-3">{{ $t("Final solution") }} :</strong> {{ solutionTime }}
                </v-flex>
              </v-layout>
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
                      <v-icon class="progress-arrow" color="green">label_important</v-icon>
                      <small>{{ $t("Open") }}</small>
                    </v-flex>
                    <v-flex xs4 class="green--text font-weight-bold">
                      <v-icon class="progress-arrow" color="green">label_important</v-icon>
                      <small>{{ $t("Processing") }}</small>
                    </v-flex>
                    <v-flex xs4>
                      <v-icon class="progress-arrow">label_important</v-icon>
                      <small>{{ $t("Closed") }}</small>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-card-text class="px-0 information">
                <strong>{{ $t("Priority") }} :</strong> Anomalie bloquante
              </v-card-text>
              <v-card-text class="px-0 information">
                <strong>{{ $t("Next step") }} :</strong> Anomalie bloquante
              </v-card-text>
              <v-card-text class="px-0 information">
                <strong>{{ $t("Environment") }} :</strong> Anomalie bloquante
              </v-card-text>
              <v-card-text class="px-0 information">
                <strong>{{ $t("Operating system") }} :</strong> Anomalie bloquante
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
                    <v-icon class="progress-arrow" color="green">label_important</v-icon>
                    <small>{{ $t("Dev") }}</small>
                  </v-flex>
                  <v-flex>
                    <v-icon class="progress-arrow">label_important</v-icon>
                    <small>{{ $t("Reversed") }}</small>
                  </v-flex>
                  <v-flex>
                    <v-icon class="progress-arrow">label_important</v-icon>
                    <small>{{ $t("Integrated") }}</small>
                  </v-flex>
                  <v-flex>
                    <v-icon class="progress-arrow">label_important</v-icon>
                    <small>{{ $t("published") }}</small>
                  </v-flex>
                  <v-flex>
                    <v-icon class="progress-arrow">label_important</v-icon>
                    <small>{{ $t("Rejected") }}</small>
                  </v-flex>
                </v-layout>
                <h3>{{ $t("Community contribution form") }}:</h3>
                <a :href="communityIssueLink">{{ communityIssueLink }}</a>
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

export default {
  data() {
    return {
      gravity: "bloquant",
      ticketNumber: 2031654656516,
      software: "GLPI",
      ticketTitle: "GLPI : importer un fichier lss dans la version 1.85",
      ticketDate: "25/09/2016 - 10h30",
      attachedFile: "",
      recallTime: "52 mn",
      bypassTime: "4JO et 52mn",
      solutionTime: "39JO et 52 mn",
      communityIssueLink: "https://github.com/glpi-project/glpi/issues/5457",
      subject: `bonjour,
      The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through.?
      The Woodman set to work at once, and so sharp was.


      Cordialement`,
      linkedTickets: [23132132131321321, 15649879461615616],
      request: {}
    };
  },
  mounted() {
    this.$http.getTicketById(this.$route.params.id).then(response => (this.request = response.data));
  },
  computed: {
    ...mapGetters({
      email: "user/getEmail"
    })
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
</style>
