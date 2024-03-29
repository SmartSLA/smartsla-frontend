<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <div>
              <h3 class="display-1 font-weight-medium mb-0">{{ isNew ? $t("Edit client") : $t("New client") }}</h3>
            </div>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout row wrap>
              <v-flex xs3 class="pt-4">
                <strong class="required-label">{{ $t("Name") }} :</strong>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model="client.name"
                  :rules="[() => (client.name && client.name.length > 0) || $i18n.t('Required field')]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Address") }} :</strong>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="client.address"></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Active") }} :</strong>
              </v-flex>
              <v-flex xs6>
                <v-switch v-model="client.active"></v-switch>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Logo") }} :</strong>
              </v-flex>
              <v-flex xs6>
                <file-upload
                  url=""
                  prepend-icon="attach_file"
                  class="file pt-2"
                  :btn-label="$i18n.t('Attach file')"
                  btn-uploading-label="Uploading file"
                ></file-upload>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Access code") }} :</strong>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="client.accessCode"></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <strong>{{ $t("Help access") }} :</strong>
              </v-flex>
              <v-flex xs6>
                <v-text-field v-model="client.accessHelp"></v-text-field>
              </v-flex>
              <v-flex xs1></v-flex>

              <v-flex xs5></v-flex>
              <v-flex xs5>
                <v-btn class="success" @click="validateFrom">{{ $t("validate") }}</v-btn>
                <v-btn color="error" @click="openDialog = true" v-if="isNew" :disabled="cannotBeDeleted">{{
                  $t("Delete")
                }}</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
          <v-dialog v-model="openDialog" persistent max-width="290">
            <v-card>
              <v-card-title class="body-2">{{ $t("You are about to delete:") }}</v-card-title>
              <v-card-text>
                <span class="pl-3">{{ $t("Client") }} : {{ client.name }}</span>
                <br />
                <br />
                <div v-if="client.contracts">
                  <span class="body-2">
                    {{
                      $t("{name} is linked to the following elements", {
                        name: client.name
                      })
                    }}
                  </span>
                  <ul>
                    <li v-for="(item, key) in client.contracts" :key="key">
                      <router-link target="_blank" :to="{ name: 'Contract', params: { id: item._id } }">
                        {{ item.name }}
                      </router-link>
                    </li>
                  </ul>
                </div>
                <span class="body-2">{{ $t("Are you sure?") }}</span>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" flat @click="openDialog = false">{{ $t("Close") }}</v-btn>
                <v-btn color="error darken-1" flat @click="deleteClient" :disabled="cannotBeDeleted">{{
                  $t("Delete")
                }}</v-btn>
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
import { cloneDeep } from "lodash";

export default {
  metaInfo() {
    return {
      title: this.isNew ? `${this.$i18n.t("Edit client")} - ${this.client.name}` : this.$i18n.t("New client")
    };
  },
  data() {
    return {
      valid: false,
      openDialog: false,
      client: {
        active: true
      }
    };
  },
  methods: {
    createClient() {
      this.client.name.trim();

      this.$store
        .dispatch("client/createClient", this.client)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Client created"),
            color: "success"
          });
          this.client = {};
          this.$router.push({ name: routeNames.CLIENTS });
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
        if (!this.isNew) {
          this.createClient();
        } else {
          this.$store
            .dispatch("client/updateClient", {
              clientId: this.client._id,
              client: this.client
            })
            .then(() => {
              this.$store.dispatch("ui/displaySnackbar", {
                message: this.$i18n.t("updated"),
                color: "success"
              });
              this.$router.push({ name: routeNames.CLIENTS });
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

    deleteClient() {
      if (!this.cannotBeDeleted) {
        this.$store
          .dispatch("client/deleteClient", this.$route.params.id)
          .then(() => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("client deleted"),
              color: "success"
            });
            this.$router.push({ name: routeNames.CLIENTS });
          })
          .catch(error => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: error.response.data.error.details,
              color: "error"
            });
          });
      }

      this.$store.dispatch("ui/displaySnackbar", {
        message: this.$i18n.t("client has related contracts"),
        color: "error"
      });
    }
  },
  computed: {
    isNew() {
      return this.$route.params.id;
    },

    cannotBeDeleted() {
      if (this.$route.params.id) {
        const { id } = this.$route.params;

        return !!this.$store.getters["contract/getContractsByClient"](id).length;
      }

      return false;
    }
  },
  mounted() {
    if (this.$route.params.id) {
      const { id } = this.$route.params;
      this.$store.dispatch("client/fetchClientById", id).then(() => {
        const data = this.$store.getters["client/getClientById"](id);
        this.client = cloneDeep(data);
      });

      this.$store.dispatch("contract/fetchContracts");
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
  margin-right: 0px !important;
  margin-left: 0px !important;
  padding-right: 0px;
  margin-top: 0px !important;
}

@media only screen and (min-width: 1264px) {
  .container {
    max-width: 100%;
  }
}

div.wrap:nth-child(2) {
  margin-left: 0px;
  margin-right: 0px;
}

div.wrap:nth-child(2) > div:nth-child(1) {
  padding-top: 0px;
  padding-left: 0px;
  margin-right: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat):not(.error) {
  background-color: #2195f2 !important;
}
</style>
