<template>
  <v-flex>
    <v-layout row class="link-type">
      <v-flex xs5 md6 mb-2>
        <v-select
          prepend-icon="link"
          :items="linkTypes"
          :label="$i18n.t('Link type')"
          v-model="type"
          item-value="key"
          item-text="value"
          single-line
          hide-details
          flat
          solo
          background-color="grey lighten-5"
        ></v-select>
      </v-flex>
      <v-flex xs6 md6 mb-2>
        <v-autocomplete
          :disabled="!contract"
          :items="relatedRequests"
          :search-input.sync="search"
          :label="$i18n.t('Related requests')"
          hide-details
          hide-selected
          return-object
          :item-text="getItemText"
          item-value="_id"
          v-model="request"
          background-color="grey lighten-5"
          flat
          solo
          hide-no-data
          :placeholder="$i18n.t('Start typing to search the related request')"
          :loading="loading"
        >
          <template v-slot:selection="data">
            {{ `#${data.item._id} - ${data.item.title}` }}
          </template>
          <template v-slot:item="data">
            <text-highlight :queries="search">
              {{ `#${data.item._id} - ${data.item.title}` }}
            </text-highlight>
          </template>
          <template v-slot:append-outer>
            <v-btn
              :disabled="!(type && request)"
              class="black--text"
              @click.native="addRequest"
              icon
              background-color="primary lighten-5"
            >
              <v-icon color="primary">mdi-plus-circle</v-icon>
            </v-btn>
          </template>
        </v-autocomplete>
      </v-flex>
    </v-layout>
    <v-layout column class="d-inline-flex ml-4 link-type">
      <div v-for="(link, key) in linked" :key="key">
        <v-chip close @input="removeRequest(link.request._id)">
          <v-avatar>
            <router-link :to="{ name: routeNames.REQUEST, params: { id: link.request._id } }" target="_blank">
              <v-icon small>open_in_new</v-icon>
            </router-link>
          </v-avatar>
          {{ `${link.link} : #${link.request._id} - ${link.request.title}` }}
        </v-chip>
      </div>
    </v-layout>
  </v-flex>
</template>

<script>
import { RELATED_REQUEST_TYPES } from "@/constants";
import { routeNames } from "@/router";
import { debounce } from "lodash";

export default {
  name: "related-requests",
  props: {
    requests: Array,
    linked: Array,
    contract: String
  },
  data() {
    return {
      type: null,
      request: null,
      search: null,
      relatedRequests: [],
      loading: false
    };
  },
  methods: {
    addRequest() {
      const { _id, title } = this.request;

      this.$emit("relatedRequest:add", {
        link: this.type,
        request: { _id, title }
      });

      this.type = this.request = null;
    },

    removeRequest(relatedRequestID) {
      this.$emit("relatedRequest:remove", relatedRequestID);
    },

    getItemText(item) {
      const { _id, title } = item;

      return `${_id} ${title}`;
    },

    searchRelatedRequest(val) {
      this.loading = true;
      return this.$http
        .searchTickets(val, this.contract)
        .then(({ data }) => {
          this.relatedRequests = data.list;
        })
        .finally(() => (this.loading = false));
    }
  },

  computed: {
    linkTypes() {
      return RELATED_REQUEST_TYPES.map(type => ({
        key: type,
        value: this.$i18n.t(type)
      }));
    },

    routeNames() {
      return routeNames;
    }
  },

  watch: {
    search: debounce(function(val) {
      val && this.searchRelatedRequest(val);
    }, 500)
  }
};
</script>
