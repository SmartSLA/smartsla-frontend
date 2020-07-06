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
          :disabled="!possibleRelatedRequests.length"
          :items="possibleRelatedRequests"
          :filter="searchRequest"
          :label="$i18n.t('Related requests')"
          hide-details
          hide-selected
          return-object
          v-model="request"
          background-color="grey lighten-5"
          flat
          solo
        >
          <template v-slot:selection="data">
            {{ `#${data.item._id} - ${data.item.title}` }}
          </template>
          <template v-slot:item="data">
            {{ `#${data.item._id} - ${data.item.title}` }}
          </template>
          <template v-slot:append-outer>
            <v-btn
              :disabled="!(type && request)"
              class="black--text"
              @click.native="addRequest"
              icon
              background-color="grey lighten-5"
            >
              <v-icon>mdi-plus-circle</v-icon>
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

export default {
  name: "related-requests",
  props: {
    requests: Array,
    linked: Array
  },
  data() {
    return {
      type: null,
      request: null
    };
  },
  methods: {
    addRequest() {
      this.$emit("relatedRequest:add", {
        link: this.type,
        request: this.request
      });

      this.type = this.request = null;
    },

    removeRequest(relatedRequestID) {
      this.$emit("relatedRequest:remove", relatedRequestID);
    },

    searchRequest(item, queryText) {
      const requestTitle = item.title.toLowerCase();
      const requestId = item._id.toLowerCase();
      const searchText = queryText.toLowerCase();

      return requestTitle.indexOf(searchText) > -1 || requestId.indexOf(searchText) > -1;
    }
  },

  computed: {
    possibleRelatedRequests() {
      let filtredList = this.requests;
      const store = this.linked.map(link => link.request);

      filtredList = filtredList.filter(item => {
        return !store.filter(request => request._id === item._id).length;
      });

      return filtredList;
    },

    linkTypes() {
      return RELATED_REQUEST_TYPES.map(type => ({
        key: type,
        value: this.$i18n.t(type)
      }));
    },

    routeNames() {
      return routeNames;
    }
  }
};
</script>
