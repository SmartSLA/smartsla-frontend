<template>
  <v-container class="pt-0 px-0 mx-1 my-3">
    <v-layout row justify-center mx-2>
      <v-flex xs12 sm12 md12 lg12 xl12>
        <v-card class="mt-4 pb-4">
          <v-layout row>
            <v-flex xs10 sm10 md10 lg12 ml-2>
              <v-card-title primary-title class="headline font-weight-medium mb-0">
                {{ ticketingUser.name }}
              </v-card-title>
            </v-flex>
            <v-layout justify-end align-center my-0 mr-2>
              <v-btn
                color="primary"
                fab
                small
                dark
                :to="{ name: isProfilePage ? routeNames.EDITPROFILE : routeNames.EDITUSER, params: { id: reqParamId } }"
              >
                <v-icon>edit</v-icon>
              </v-btn>
            </v-layout>
          </v-layout>
          <v-divider class="mx-2"></v-divider>
          <v-layout column mt-3 mx-5>
            <v-flex py-0 v-for="(element, index) in ticketingUser" :key="index.value">
              <span v-if="filteredElements(index)">
                <strong v-if="index">{{ $t(capitalize(index)) }} :</strong>
                <span v-if="element"> {{ $t(element) }}</span>
              </span>
            </v-flex>
            <v-flex py-0 v-if="$auth.check('admin') && ticketingUser.client">
              <strong>{{ $t("Client") }} : </strong>
              <router-link
                v-if="ticketingUser.client.id"
                :to="{ name: 'Client', params: { id: ticketingUser.client.id } }"
                target="_blank"
              >
                {{ ticketingUser.client.name }}
              </router-link>
            </v-flex>
            <v-flex py-0 v-if="$auth.check('admin') && ticketingUser.contracts && ticketingUser.contracts.length">
              <strong>{{ $t("Contrats") }} :</strong>
              <ul>
                <li v-for="entry in ticketingUser.contracts" :key="entry._id">
                  <router-link :to="{ name: 'Contract', params: { id: entry.contract._id } }" target="_blank">
                    <span class="blue-color"> {{ capitalize(entry.contract.name) }} </span>
                  </router-link>
                  <v-spacer />
                  <span>
                    <span class="font-italic font-weight-bold">{{ $t("Role") }}: </span>
                    <span>{{ $t(entry.role) }}</span>
                  </span>
                </li>
              </ul>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { capitalize } from "lodash";
import { routeNames } from "@/router";

export default {
  metaInfo() {
    return {
      titleTemplate: `%s - ${this.ticketingUser.name}`
    };
  },
  data() {
    return {
      reqParamId: this.$route.params.id
    };
  },
  methods: {
    filteredElements(index) {
      switch (index) {
        case "name":
        case "type":
        case "email":
        case "phone":
        case "team":
        case "role":
        case "jobTitle":
          return index;
      }
    },
    capitalize(term) {
      return capitalize(term);
    },
    getClientById(clientId) {
      return this.$store.getters["client/getClientById"](clientId);
    }
  },
  computed: {
    ticketingUser() {
      const { id } = this.$route.params;
      const user = this.$store.getters["users/getUserById"](id);
      const { contracts } = user;
      let client;

      if (contracts && contracts.length) {
        const firstContract = contracts[0].contract;
        client = {
          name: firstContract && firstContract.client,
          id: firstContract && firstContract.clientId
        };
      }

      if (user && user.client) {
        client = {
          id: user.client,
          name: this.getClientById(user.client).name
        };
      }

      return {
        ...user,
        client
      };
    },
    isProfilePage() {
      return this.$route.name === routeNames.PROFILE;
    },
    routeNames() {
      return routeNames;
    }
  },
  created() {
    this.$store.dispatch("users/fetchUserById", this.$route.params.id);
  }
};
</script>
