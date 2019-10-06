<template>
   <v-layout row>
      <v-flex xs12 md8 offset-md2>
        <v-card class="pa-1 ma-2">
          <v-card-text>
            <v-autocomplete
              v-model="users"
              :items="items"
              :loading="isLoading"
              :search-input.sync="searchUsers"
              chips
              item-text="name"
              item-value="name"
              :label="$t('Users')"
              multiple
              cache-items
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
                <v-chip
                  :selected="data.selected"
                  close
                  @input="removeChip(data.item, data)"
                >
                  <v-avatar>
                    <img :src="data.item.avatar_url">
                  </v-avatar>
                  {{ data.item.name }}
                </v-chip>
              </template>

              <template slot="item" slot-scope="data">
                <v-list-tile-avatar>
                  <v-avatar :size="30">
                    <img :src="data.item.avatar_url"/>
                  </v-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-text="data.item.name"></v-list-tile-title>
                </v-list-tile-content>
              </template>
            </v-autocomplete>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="isCreating || !users || !users.length"
              @click="createAdministrators"
            >
              {{ $t("Add") }}
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="pa-1 ma-2">
          <v-card-title primary-title>
            <h3 class="headline mb-0">{{ $t("Administrators") }}</h3>
          </v-card-title>
          <v-card-text>
            <v-list v-if="adminRoles && adminRoles.length" subheader two-line>
              <v-list-tile v-for="role in adminRoles" :key="role._id">
                <v-list-tile-content>
                  <v-list-tile-title>{{ role.user.displayName }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ role.user.preferredEmail }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" flat icon dark color="grey" @click="removeRole(role._id)"><v-icon>clear</v-icon></v-btn>
                    </template>
                    <span>{{$t("Remove")}}</span>
                  </v-tooltip>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <div v-else class="text-xs-center">
              <span class="body-2 grey--text">{{ $t("There are no administrators") }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
   </v-layout>
</template>

<script>
export default {
  name: "AdminRoles",
  data: () => ({
    roles: null,
    isLoading: false,
    isCreating: false,
    searchUsers: null,
    users: null,
    items: []
  }),
  mounted() {
    this.fetchRoles();
  },
  methods: {
    fetchRoles() {
      this.$http.getUsersRoles().then(roles => this.roles = roles)
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("Error while loading administrators"),
          color: "error"
        });
      });
    },
    removeRole(id) {
      this.$http.deleteRole(id).then(() => {
        // remove from list
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("Error while deleting role"),
          color: "error"
        });
      });
    },
    createAdministrators() {
      if (!this.users) {
        return;
      }
      this.isCreating = true;
      this.$http.createRoles(this.users.map(user => ({ role: "administrator", user: user._id })))
        .then(() => {
          this.users = null;
          this.fetchRoles();
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Administrators have been added"),
            color: "success"
          });
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Error while adding administrators"),
            color: "error"
          });
        })
        .finally(() => this.isCreating = false);
    },
    removeChip(item) {
      const index = this.users.findIndex(user => user.id === item.id);
      if (index >= 0) this.users.splice(index, 1);
    }
  },
  computed: {
    adminRoles() {
      return this.roles ? this.roles.filter(role => role.role !== "administrator") : [];
    }
  },
  watch: {
    searchUsers(val) {
      if (!val || val === null) {
        return;
      }
      this.isLoading = true;
      this.$http.searchPeople(val, ["user"])
        .then(results => results.map(person => ({
          avatar_url: person.photos[0].url,
          _id: person.id,
          name: person.names[0].displayName,
          email: person.emailAddresses[0].value
        })))
        .then(results => (this.items = results))
        .catch(console.log)
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
