<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Softwares' }"
      >&lt; {{ $t("Return to software list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <div>
              <h3 class="display-1 font-weight-medium mb-0">{{ isNew ? $t("Edit Software") : $t("New Software") }}</h3>
            </div>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout row wrap>
              <v-flex xs3 class="pt-4">
                <strong class="required-label">{{ $t("Name") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="software.name"
                  :rules="[() => software.name.length > 0 || $i18n.t('Required field')]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Summary") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-text-field v-model="software.summary"></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Description") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-textarea name="description"></v-textarea>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Logo") }} :</strong>
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
                <strong>{{ $t("Licence") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-select :items="licenceList"></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Private") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-switch v-model="software.private"></v-switch>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Technology") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-select :items="technologies"></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Groupes") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-select :items="groups"></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs5></v-flex>
              <v-flex xs5>
                <v-btn class="success" @click="validateFrom">{{ $t("validate") }}</v-btn>
                <v-btn color="error" dark @click="openDialog = true" v-if="isNew">{{ $t("Delete") }}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
          <v-dialog v-model="openDialog" persistent max-width="290">
            <v-card>
              <v-card-title class="body-2">{{ $t("You are about to delete:") }}</v-card-title>
              <v-card-text>
                <span class="pl-3">{{ $t("Software") }} : {{ software.name }}</span>
                <br />
                <br />
                <span class="body-2">{{ $t("is linked to the following elements") }}</span>
                <br />
                -
                <br />
                <span class="body-2">{{ $t("Are you sure?") }}</span>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" flat @click="openDialog = false">close</v-btn>
                <v-btn color="red darken-1" flat @click="deleteSoftware">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      openDialog: false,
      software: {},
      licenceList: [
        "Apache License 2.0",
        "BSD 3-Clause 'New' or 'Revised' license",
        "BSD 2-Clause 'Simplified' or 'FreeBSD' license",
        "GNU General Public License (GPL)",
        "GNU Library or 'Lesser' General Public License (LGPL)",
        "MIT license",
        "Mozilla Public License 2.0",
        "Common Development and Distribution License",
        "Eclipse Public License"
      ],
      technologies: [
        "Annuaires",
        "C#/Mono",
        "C/C++",
        "Desktop Gestion",
        "J2EE",
        "Java",
        "Lua",
        "NoSQL",
        "OpenOffice",
        "Perl",
        "PHP",
        "Python",
        "Réseau",
        "Ruby",
        "SQLSystème",
        "Web"
      ],
      groups: [
        "SIG",
        "Frameworks de développement",
        "Portail",
        "Sécurité SGBD",
        "Systèmes d'exploitation",
        " Serveurs d'applications",
        "Serveurs de fichiers",
        "Collaboratif",
        " Supervision",
        " Outils de tests",
        "Publication",
        "Infrastructure (proxies, annuaires, DNS)",
        "Exploitation",
        "Réseaux",
        "Messagerie Administration",
        "Outils et langages",
        "Bureautique",
        "Serveurs web"
      ]
    };
  },
  computed: {
    isNew() {
      return this.$route.params.id;
    }
  },
  created() {
    if (this.$route.params.id) {
      this.software = require("@/assets/data/softwares.json")[4];
    }
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "software");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    this.$store.dispatch("sidebar/resetAdminMenu");

    next();
  },
  methods: {
    createSoftware() {
      this.$http
        .createSoftware(this.software)
        .then(response => {
          if (response.data && response.status === 201) {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("Software created"),
              color: "success"
            });
            this.software = {};
          }
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },

    validateFrom() {
      if (this.$refs.form.validate()) {
        this.createSoftware();
      } else {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("the required fields must be filled"),
          color: "error"
        });
      }
    },

    deleteSoftware() {
      this.$http
        .deleteSoftware(this.software._id)
        .then(response => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Software deleted"),
            color: "success"
          });
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
  cursor: pointer;
}

.pt-0 {
  margin: 0px !important;
  padding-right: 0px;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: #2196f3 !important;
}
</style>
