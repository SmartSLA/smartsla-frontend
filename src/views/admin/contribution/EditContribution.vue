<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Contributions' }"
      >&lt; {{ $t("Return to contributions list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <div>
              <h3 class="display-1 font-weight-medium mb-0">
                {{ isEditing ? $t("Edit Contribution") : $t("New Contribution") }}
              </h3>
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
                  v-model="contribution.name"
                  :rules="[() => (contribution.name && contribution.name.length > 0) || $i18n.t('Required field')]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong class="required-label">{{ $t("Software") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-select
                  :items="software"
                  item-text="name"
                  item-value="_id"
                  v-model="contribution.software"
                  :rules="[
                    () => (contribution.software && contribution.software.length > 0) || $i18n.t('Required field')
                  ]"
                ></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong class="required-label">{{ $t("Author") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-select
                  :items="users"
                  item-text="name"
                  item-value="_id"
                  v-model="contribution.author"
                  :rules="[() => (contribution.author && contribution.author.length > 0) || $i18n.t('Required field')]"
                ></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Contribution type") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-select
                  v-model="contribution.type"
                  :items="types"
                  item-text="value"
                  item-value="key"
                  :rules="[() => (contribution.type && contribution.type.length > 0) || $i18n.t('Required field')]"
                ></v-select>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong class="required-label">{{ $t("Version") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="contribution.version"
                  :rules="[
                    () => (contribution.version && contribution.version.length > 0) || $i18n.t('Required field')
                  ]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Patched in version") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-text-field v-model="contribution.fixedInVersion"></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("links") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-layout row wrap v-for="(link, index) in contribution.links" :key="index">
                  <v-flex xs4>
                    <v-layout row>
                      <v-flex :class="contribution.links[index].name === 'Other' ? 'xs4' : 'xs12'">
                        <v-select
                          :items="linkNames"
                          v-model="contribution.links[index].name"
                          item-text="value"
                          item-value="key"
                          prepend-icon="link"
                          :label="$t('Link Name')"
                          :rules="[name => !!name || $i18n.t('Required field')]"
                        ></v-select>
                      </v-flex>
                      <v-flex>
                        <v-text-field
                          v-if="contribution.links[index].name === 'Other'"
                          v-model="contribution.links[index].othername"
                          :label="$t('Link Name')"
                          :rules="[name => !!name || $i18n.t('Required field')]"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <v-text-field
                      v-model="contribution.links[index].url"
                      :label="$t('External Link')"
                      :rules="[url => isUrl(url) || $i18n.t('Required field')]"
                    ></v-text-field>
                  </v-flex>
                  <v-flex shrink>
                    <v-btn flat icon color="red lighten-2" @click="removeLink(index)">
                      <v-icon>cancel</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-btn flat icon color="green lighten-2" @click="addLink">
                  <v-icon>add_circle</v-icon>
                </v-btn>
                {{ $t("add a new link") }}
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
                      v-model="contribution.deposedAt"
                      persistent-hint
                      prepend-icon="event"
                      @blur="contribution.deposedAt = parseDate(contribution.deposedAt)"
                      v-on="on"
                      :rules="[
                        () => (contribution.deposedAt && contribution.deposedAt.length > 0) || $i18n.t('Required field')
                      ]"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="contribution.deposedAt"
                    no-title
                    @input="startDateModel = false"
                    :rules="[
                      () => (contribution.deposedAt && contribution.deposedAt.length > 0) || $i18n.t('Required field')
                    ]"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong class="required-label">{{ $t("Description") }} :</strong>
              </v-flex>
              <v-flex xs8>
                <v-textarea
                  v-model="contribution.description"
                  :rules="[
                    () => (contribution.description && contribution.description.length > 0) || $i18n.t('Required field')
                  ]"
                ></v-textarea>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs5></v-flex>
              <v-flex xs2>
                <v-card-actions>
                  <v-btn class="success" @click="validateFrom">{{ $t("Submit") }}</v-btn>
                  <v-btn class="error" v-if="isEditing" @click="deleteDialog = true">{{ $t("Delete") }}</v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
            <v-dialog v-model="deleteDialog" persistent max-width="290">
              <v-card>
                <v-card-text>
                  {{ $t("Are you sure you want to delete this contribution?") }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary darken-1" solo @click="deleteContribution">{{ $t("Confirm") }}</v-btn>
                  <v-btn color="error darken-1" solo @click="deleteDialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { USER_TYPE, CONTRIBUTION_TYPES, CONTRIBUTION_LINK_TYPES } from "@/constants.js";
import { routeNames } from "@/router";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      valid: true,
      deleteDialog: false,
      startDateModel: "",
      contribution: {
        links: [
          {
            name: "",
            url: "",
            othername: ""
          }
        ]
      },
      types: CONTRIBUTION_TYPES.map(contributionType => ({
        key: contributionType,
        value: this.$i18n.t(contributionType)
      })),
      linkNames: CONTRIBUTION_LINK_TYPES.map(contributionLinkType => ({
        key: contributionLinkType,
        value: this.$i18n.t(contributionLinkType)
      })),
      software: [],
      users: []
    };
  },
  computed: {
    ...mapGetters({
      software: "software/getSoftwareList"
    }),

    isEditing() {
      return this.$route.params.id;
    }
  },
  methods: {
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    addLink() {
      this.contribution.links.push({
        name: "",
        url: "",
        othername: ""
      });
    },

    removeLink(index) {
      this.contribution.links.splice(index, 1);
    },

    isUrl(uri) {
      const pattern = /(http|https|ftp):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/;

      if (uri) {
        return pattern.test(uri);
      }

      return false;
    },

    create() {
      this.$store
        .dispatch("contribution/createContribution", this.contribution)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("contribution created"),
            color: "success"
          });
          this.$router.push({ name: routeNames.CONTRIBUTIONS });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },

    update() {
      this.$store
        .dispatch("contribution/updateContribution", {
          contributionId: this.contribution._id,
          contribution: this.contribution
        })
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("contribution updated"),
            color: "success"
          });
          this.$router.push({ name: routeNames.CONTRIBUTIONS });
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Failed to update contribution"),
            color: "error"
          });
        });
    },

    validateFrom() {
      if (this.$refs.form.validate()) {
        this.contribution.links = this.contribution.links.map(link => {
          return {
            name: link.othername || link.name,
            url: link.url
          };
        });

        this.isEditing ? this.update() : this.create();
      } else {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("the required fields must be filled"),
          color: "error"
        });
      }
    },

    deleteContribution() {
      this.$store
        .dispatch("contribution/deleteContribution", this.$route.params.id)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("contribution deleted"),
            color: "success"
          });
          this.$router.push({ name: routeNames.CONTRIBUTIONS });
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Failed to delete contribution"),
            color: "error"
          });
        });
    }
  },

  created() {
    this.$store.dispatch("software/fetchSoftwareList");
    this.$http
      .listUsers(USER_TYPE.EXPERT)
      .then(({ data }) => {
        this.users = data;
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("cannot fetch experts list"),
          color: "error"
        });
      });

    if (this.$route.params.id) {
      const { id } = this.$route.params;
      this.$store.dispatch("contribution/fetchContributionById", id).then(() => {
        const data = this.$store.getters["contribution/getContributionById"](id);
        const { software, author, links } = data;

        this.contribution = {
          ...data,
          author: author._id,
          software: software._id,
          links: links.map(link => {
            let { url, name } = link;
            let existingLinkType = this.linkNames.find(linkName => linkName.key === name);

            return existingLinkType
              ? {
                  url,
                  name: existingLinkType.key,
                  value: existingLinkType.value
                }
              : {
                  url,
                  name: "Other",
                  othername: name
                };
          })
        };
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

.container {
  max-width: 100% !important;
  padding: 0px;
}

@media only screen and (min-width: 1264px) {
  .container {
  max-width: 100% !important;
  padding-right: 24px;
}
}
</style>
