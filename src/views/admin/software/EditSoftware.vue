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
                  :rules="[() => (software.name && !!software.name.length) || $i18n.t('Required field')]"
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
                <v-textarea name="description" v-model="software.description"></v-textarea>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Licence") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-select :items="licenceList" v-model="software.licence"></v-select>
              </v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Technology") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-select :items="technologies" v-model="software.technology"></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Groupes") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-select :items="groups" v-model="software.group"></v-select>
              </v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("External Links") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <external-links :externalLinks="externalLinks" @remove-link="removeExternalLink">
                  <div>
                    {{ $t("Add an external link") }}
                    <v-btn @click="addExternalLink()" flat icon color="primary">
                      <v-icon>add_circle</v-icon>
                    </v-btn>
                  </div>
                </external-links>
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
                <br />-
                <br />
                <span class="body-2">{{ $t("Are you sure?") }}</span>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" flat @click="openDialog = false">close</v-btn>
                <v-btn color="error darken-1" flat @click="deleteSoftware">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { routeNames } from "@/router";
import ExternalLinks from "@/components/ExternalLinks.vue";
import { cloneDeep } from "lodash";

export default {
  data() {
    return {
      valid: false,
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
      ],
      externalLinks: []
    };
  },
  components: {
    ExternalLinks
  },
  computed: {
    isNew() {
      return this.$route.params.id;
    }
  },
  methods: {
    createSoftware() {
      this.$store
        .dispatch("software/createSoftware", this.software)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Software created"),
            color: "success"
          });
          this.software = {};
          this.$router.push({ name: routeNames.SOFTWARELIST });
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
        this.software.externalLinks = this.externalLinks;
        if (!this.isNew) {
          this.createSoftware();
        } else {
          this.$store
            .dispatch("software/updateSoftware", {
              softwareId: this.software._id,
              software: this.software
            })
            .then(() => {
              this.$store.dispatch("ui/displaySnackbar", {
                message: this.$i18n.t("updated"),
                color: "success"
              });
              this.$router.push({ name: routeNames.SOFTWARELIST });
            })
            .catch(error => {
              this.$store.dispatch("ui/displaySnackbar", {
                message: error.response.data.error.details,
                color: "error"
              });
            });
        }
      } else {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("the required fields must be filled"),
          color: "error"
        });
      }
    },

    deleteSoftware() {
      this.$store
        .dispatch("software/deleteSoftware", this.$route.params.id)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Software deleted"),
            color: "success"
          });
          this.$router.push({ name: routeNames.SOFTWARELIST });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },
    addExternalLink(name, url) {
      this.externalLinks.push({
        name: name,
        url: url
      });
    },
    removeExternalLink(index) {
      this.externalLinks.splice(index, 1);
    }
  },
  created() {
    if (this.$route.params.id) {
      const { id } = this.$route.params;
      this.$store.dispatch("software/fetchSoftwareById", id).then(() => {
        const data = this.$store.getters["software/getSoftwareById"](id);
        this.software = cloneDeep(data);
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

.container {
  max-width: 100% !important;
  padding: 0px;
}
.pt-0 {
  margin: 0px !important;
  padding-right: 0px;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat):not(.error) {
  background-color: #2196f3 !important;
}
@media only screen and (min-width: 1264px) {
  .container {
  max-width: 100% !important;
  padding-right: 24px;
}
}
</style>
