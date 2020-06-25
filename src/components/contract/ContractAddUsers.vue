<template>
  <v-container grid-list-md>
    <v-layout row wrap justify-space-between>
      <v-flex xs12>
        <v-card flat>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-layout row wrap>
              <v-flex xs3 class="pt-4">
                <span class="subheading">{{ $t("Search") }}</span>
              </v-flex>
              <v-flex xs8>
                <v-autocomplete
                  v-model="members"
                  :items="items"
                  :loading="isLoading"
                  :search-input.sync="search"
                  chips
                  deletable-chips
                  multiple
                  hide-selected
                  cache-items
                  item-text="name"
                  item-value="name"
                  :label="$t('Users')"
                  @input="search = null"
                  return-object
                >
                  <template slot="no-data">
                    <v-list-tile>
                      <v-list-tile-title>
                        {{ $t("Please refine your search...") }}
                      </v-list-tile-title>
                    </v-list-tile>
                  </template>

                  <template slot="selection" slot-scope="data">
                    <v-chip :selected="data.selected">
                      <v-avatar>
                        <img :src="data.item.avatar_url" />
                      </v-avatar>
                      {{ data.item.name }}
                    </v-chip>
                  </template>

                  <template slot="item" slot-scope="data">
                    <v-list-tile-avatar>
                      <v-avatar size="35">
                        <img :src="data.item.avatar_url" />
                      </v-avatar>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-text="data.item.name"></v-list-tile-title>
                    </v-list-tile-content>
                  </template>
                </v-autocomplete>
              </v-flex>
              <v-flex xs1></v-flex>
              <v-flex xs3 class="pt-4">
                <span class="subheading required-label">{{ $t("Role") }}</span>
              </v-flex>
              <v-flex xs8>
                <v-radio-group v-model="role" row mandatory color="primary">
                  <v-radio
                    v-for="beneficiaryRole in beneficiaryRoles"
                    :key="beneficiaryRole"
                    :label="$t(beneficiaryRole)"
                    :value="beneficiaryRole"
                  ></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex v-if="members && members.length > 1" class="text--disabled pb-4">
                <span>{{ $t("All selected users will have the same chosen role.") }}</span>
              </v-flex>
              <v-flex xs12>
                <v-btn :disabled="!members || isAdding" :loading="isAdding" @click="submit">
                  {{ $t("Add") }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
const DEFAULT_ROLE = "customer";
import { BENEFICIARY_ROLES } from "@/constants.js";

export default {
  props: {
    contract: Object,
    contractUsers: Array
  },
  data() {
    return {
      members: null,
      isLoading: false,
      isAdding: false,
      items: [],
      search: null,
      valid: true,
      role: DEFAULT_ROLE
    };
  },
  watch: {
    search(val) {
      if (!val || val === null) {
        return;
      }
      this.isLoading = true;
      this.$http
        .searchPeople(val, ["user"])
        .then(results =>
          results.map(person => ({
            avatar_url: person.photos[0].url,
            name: person.names[0].displayName,
            email: person.emailAddresses[0].value,
            id: person.id
          }))
        )
        .then(results => this.generateItems(results))
        .catch(console.log)
        .finally(() => (this.isLoading = false));
    }
  },
  methods: {
    addUser() {
      this.isAdding = true;
      this.members = this.members.map(member => {
        return { user: member.id, role: this.role };
      });

      this.$store
        .dispatch("contract/addUsersToContract", { contractId: this.contract._id, users: this.members })
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("User added to contract"),
            color: "success"
          });
          this.$emit("user:added");
          this.members = null;
          this.role = DEFAULT_ROLE;
          this.$emit("close");
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Error while adding user"),
            color: "error"
          });
        })
        .finally(() => (this.isAdding = false));
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.addUser();
      }
    },
    generateItems(results) {
      let destructuredUsers = this.contractUsers.map(user => (user = user.user._id));
      this.items = results.filter(result => ![...destructuredUsers].includes(result.id));
    }
  },
  computed: {
    beneficiaryRoles() {
      return BENEFICIARY_ROLES;
    }
  }
};
</script>
