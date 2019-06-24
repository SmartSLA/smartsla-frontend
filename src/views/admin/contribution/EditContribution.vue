<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link
      class="text-lg-left action-links"
      :to="{ name: 'AdminContributions' }"
    >&lt; {{ $t("Return to contributions list") }}</router-link>
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <div>
              <h3
                class="display-1 font-weight-medium mb-0"
              >{{ isNew ? $t("Edit Contribution") : $t("New Contribution") }}</h3>
            </div>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap>
            <v-flex xs3 class="pt-4">
              <strong class="required-label">{{ $t("Name") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field
                v-model="contribution.name"
                :rules="[() => contribution.name.length > 0 || $i18n.t('Required field')]"
              ></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong class="required-label">{{ $t("Software") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-select :items="software" :rules="['required']" required></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong class="required-label">{{ $t("Engineer") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-select :items="users" :rules="['required']" required></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Request Number") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="contribution.requestNumber"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Patch") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <file-upload
                prepend-icon="attach_file"
                class="file pt-2"
                url
                btn-label="Attach file"
                btn-uploading-label="Uploading file"
              ></file-upload>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Contribution Type") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-select :items="types"></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong class="required-label">{{ $t("Version") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-select :items="version" :rules="['required']" required></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Patched in version") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-select :items="version"></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Status") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-select :items="statusList"></v-select>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Communication link") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="contribution.link"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong class="required-label">{{ $t("Deposed on") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-menu
                v-model="startDateModel"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="contribution.startDate"
                    persistent-hint
                    prepend-icon="event"
                    @blur="contribution.startDate = parseDate(contribution.startDate)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="contribution.startDate"
                  no-title
                  @input="startDateModel = false"
                  :rules="[() => contribution.startDate.length > 0 || $i18n.t('Required field')]"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong>{{ $t("closed on") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-menu
                v-model="endDateModel"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="contribution.endDate"
                    persistent-hint
                    prepend-icon="event"
                    @blur="contribution.endDate = parseDate(contribution.endDate)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="contribution.endDate"
                  no-title
                  @input="endDateModel = false"
                  :rules="[() => contribution.endDate.length > 0 || $i18n.t('Required field')]"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs1></v-flex>

            <v-flex xs3 class="pt-4">
              <strong>{{ $t("Synthesis") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="contribution.synthesis"></v-text-field>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3 class="pt-4">
              <strong class="required-label">{{ $t("Description") }} :</strong>
            </v-flex>
            <v-flex xs8>
              <v-textarea
                v-model="contribution.synthesis"
                :rules="[() => contribution.synthesis.length > 0 || $i18n.t('Required field')]"
              ></v-textarea>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs5></v-flex>
            <v-flex xs2>
              <v-btn class="success">{{ $t("validate") }}</v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      startDateModel: "",
      endDateModel: "",
      contribution: {},
      types: ["Backport", "Correction", "Evolution"],
      version: ["1.0", "2.1", "3.2", "4.0", "5.1"],
      statusList: ["accepted", "non reversed", "proposed", "rejected"]
    };
  },
  computed: {
    isNew() {
      return this.$route.params.id;
    }
  },
  methods: {
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  },
  created() {
    if (this.$route.params.id) {
      this.contribution = require("@/assets/data/contributions.json");
    }
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "contributions");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    this.$store.dispatch("sidebar/resetAdminMenu");

    next();
  }
};
</script>
<style lang="stylus" scoped>
.action-links {
  text-decoration: none;
  color: grey;
  cursor: pointer;
}

.pt-0 {
  margin: 0px !important;
  padding-right: 0px;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: #2195f2 !important;
}
</style>
