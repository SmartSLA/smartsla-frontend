<template>
  <v-navigation-drawer
    app
    clipped
    :fixed="!isMobile ? true : false"
    :permanent="isMobile ? true : false"
    :temporary="isMobile ? true : false"
    light
    width="270"
    :mini-variant="drawer.mini"
    mini-variant-width="60"
    mobile-break-point="450"
    right
  >
    <v-list class="py-0">
      <v-list-tile v-if="!isMobile" @click="drawer.mini = !drawer.mini">
        <v-list-tile-content v-if="!drawer.mini">
          <v-list-tile-title class="body-1 ml-2">{{ $t("Collapse menu") }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>{{ drawer.mini ? "chevron_left" : "chevron_right" }}</v-icon>
        </v-list-tile-action>
      </v-list-tile>
      <v-list-tile v-else @click="emitRequestNavigationDrawerStatus">
        <v-list-tile-content>
          <v-list-tile-title class="body-1">{{ $t("Collapse menu") }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>chevron_right</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-divider class="d-block"></v-divider>

    <v-list two-line subheader class="py-0">
      <v-list-tile-avatar v-if="drawer.mini" @click="drawer.mini = false" size="24">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-img
              v-if="!isEmpty(request.assignedTo) && request.assignedTo.id"
              v-on="on"
              :src="`${apiUrl}/api/users/${request.assignedTo.id}/profile/avatar`"
            ></v-img>
            <v-icon v-else medium size="24" v-on="on">account_circle</v-icon>
          </template>
          <span>
            <b>{{ $t("Assignee") }}</b>
            <br />
            {{
              !isEmpty(request.assignedTo) && request.assignedTo.name ? request.assignedTo.name : $t("Not assigned yet")
            }}
          </span>
        </v-tooltip>
      </v-list-tile-avatar>
      <v-list-tile v-if="!drawer.mini">
        <v-layout column align-center justify-center px-0>
          <v-layout v-if="!editAssignee" row align-center class="body-1">
            <v-list-tile-title>
              {{ $t("Assignee") }}
            </v-list-tile-title>
            <v-flex>
              <a @click="editAssignee = true" class="black--text">
                {{ $t("Edit") }}
              </a>
            </v-flex>
          </v-layout>
          <v-layout row align-center v-if="!editAssignee">
            <v-flex>
              <v-list-tile-avatar v-if="!isEmpty(request.assignedTo) && request.assignedTo.id" size="30" class="px-0">
                <v-img :src="`${apiUrl}/api/users/${request.assignedTo.id}/profile/avatar`"></v-img>
              </v-list-tile-avatar>
            </v-flex>
            <v-flex>
              <v-list-tile-content v-if="!isEmpty(request.assignedTo) && request.assignedTo.id">
                <v-list-tile-title class="body-1">
                  {{ request.assignedTo && request.assignedTo.name }}
                </v-list-tile-title>
                <v-list-tile-sub-title v-if="request.assignedTo.email" class="caption">
                  <a
                    :href="`mailto:${request.assignedTo.email}?subject=[${getUser.name}] - ${request.title}`"
                    class="grey--text text--darken-1"
                  >
                    {{ request.assignedTo.email }}
                  </a>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content v-else>
                <v-list-tile-sub-title class="caption">
                  {{ $t("Not assigned yet") }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-flex>
          </v-layout>
          <v-container v-else>
            <UserListAssignmentNavigationDrawer
              :setRequestRole="setRequestRole"
              :responsible.sync="newResponsible"
              :request="request"
            ></UserListAssignmentNavigationDrawer>
          </v-container>
        </v-layout>
      </v-list-tile>

      <v-divider class="mx-3 my-1"></v-divider>

      <v-list-tile-avatar v-if="drawer.mini" @click="drawer.mini = false" size="24" class="my-3">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-img
              v-if="request.responsible"
              v-on="on"
              :src="`${apiUrl}/api/users/${request.responsible.id}/profile/avatar`"
            ></v-img>
            <v-icon v-else medium size="24" v-on="on">account_circle</v-icon>
          </template>
          <span>
            <b>{{ $t("Interlocutor") }}</b>
            <br />
            {{
              request.responsible && request.responsible.name
                ? request.responsible.name
                : $t("No interlocutor in charge")
            }}
          </span>
        </v-tooltip>
      </v-list-tile-avatar>
      <v-list-tile v-if="!drawer.mini">
        <v-layout column align-center justify-center px-0>
          <v-list-tile-title class="body-1">
            {{ $t("Interlocutor") }}
          </v-list-tile-title>
          <v-layout row align-center>
            <v-flex>
              <v-list-tile-avatar v-if="request.responsible" size="30" class="px-0">
                <v-img :src="`${apiUrl}/api/users/${request.responsible.id}/profile/avatar`"></v-img>
              </v-list-tile-avatar>
            </v-flex>
            <v-flex>
              <v-list-tile-content v-if="request.responsible">
                <v-list-tile-title class="body-1">
                  {{ request.responsible && request.responsible.name }}
                </v-list-tile-title>
                <v-list-tile-sub-title v-if="request.responsible.email" class="caption">
                  <a
                    :href="`mailto:${request.responsible.email}?subject=[${getUser.name}] - ${request.title}`"
                    class="grey--text text--darken-1"
                  >
                    {{ request.responsible.email }}
                  </a>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content v-else>
                <v-list-tile-sub-title class="caption">
                  {{ $t("No interlocutor in charge") }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-list-tile>

      <v-divider class="mx-3 my-1"></v-divider>

      <v-list-tile-avatar v-if="drawer.mini" @click="drawer.mini = false" size="24" class="my-3">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-img
              v-if="request.beneficiary.id"
              v-on="on"
              :src="`${apiUrl}/api/users/${request.beneficiary.id}/profile/avatar`"
            ></v-img>
            <v-icon v-else large>person</v-icon>
          </template>

          <span>
            <b>{{ $t("Beneficiary") }}</b>
            <br />
            {{ request.beneficiary && request.beneficiary.name }}
          </span>
        </v-tooltip>
      </v-list-tile-avatar>
      <v-list-tile v-if="!drawer.mini">
        <v-layout column align-center justify-center px-0>
          <v-list-tile-title class="body-1">
            {{ $t("Beneficiary") }}
          </v-list-tile-title>
          <v-layout row align-center>
            <v-flex>
              <v-list-tile-avatar v-if="request.beneficiary.id" size="30" class="px-0">
                <v-img :src="`${apiUrl}/api/users/${request.beneficiary.id}/profile/avatar`"></v-img>
              </v-list-tile-avatar>
            </v-flex>
            <v-flex>
              <v-list-tile-content v-if="request.beneficiary">
                <v-list-tile-title class="body-1">
                  {{ request.beneficiary && request.beneficiary.name }}
                </v-list-tile-title>
                <v-list-tile-sub-title v-if="request.beneficiary.email" class="caption">
                  <a
                    :href="`mailto:${request.beneficiary.email}?subject=[${getUser.name}] - ${request.title}`"
                    class="grey--text text--darken-1"
                  >
                    {{ request.beneficiary.email }}
                  </a>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content v-else>
                <v-list-tile-title>
                  {{ $t("No beneficiary in charge") }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-list-tile>
      <v-container v-if="!drawer.mini" class="py-2">
        <v-layout row>
          <v-flex xs6 v-if="beneficiaryPhoneNumber" class="caption">
            <v-icon small class="mr-1">phone</v-icon>
            <a :href="`tel:${beneficiaryPhoneNumber}`">{{ beneficiaryPhoneNumber }}</a>
          </v-flex>
          <v-flex xs6 v-if="request.meetingId" class="caption">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small class="mr-1">duo</v-icon>
              </template>
              <b>Meeting ID</b>
            </v-tooltip>
            {{ request.meetingId }}
          </v-flex>
        </v-layout>
        <v-flex v-if="request.contract" class="caption ml-3 mt-1">
          <client-contract-links :contractId="request.contract" />
        </v-flex>
      </v-container>

      <v-divider class="mx-3 my-1"></v-divider>

      <v-list-tile-avatar v-if="drawer.mini" @click="drawer.mini = false">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-layout v-on="on" column align-center>
              <v-icon size="24">schedule</v-icon>
              <span class="grey--text letter-spacing">{{ $t(capitalize(calculateCnsType(request))) }}</span>
            </v-layout>
          </template>
          <span>
            <b>{{ $t("Service deadlines") }}</b>
            <br />
            {{
              !isEmpty(request.cns)
                ? $t(capitalize(calculateCnsType(request)))
                : $t("There is no service deadline for this ticket")
            }}
            <br />
            <cns-progress-bar
              v-if="!isEmpty(request.cns)"
              :ticket="request"
              :cnsType="calculateCnsType(request)"
              :hideClock="true"
            ></cns-progress-bar>
          </span>
        </v-tooltip>
      </v-list-tile-avatar>
      <v-container v-if="!isEmpty(request.cns) && !drawer.mini" class="pa-2">
        <v-list-tile-title class="body-1">{{ $t("Service deadlines") }}</v-list-tile-title>

        <v-list-tile-sub-title class="caption ml-2">{{ $t("cns.state.support") }} </v-list-tile-sub-title>
        <cns-progress-bar :ticket="request" :cnsType="'supported'" class="mx-4"></cns-progress-bar>

        <v-list-tile-sub-title class="caption ml-2">{{ $t("cns.state.bypass") }}</v-list-tile-sub-title>
        <cns-progress-bar :ticket="request" :cnsType="'bypassed'" class="mx-4"></cns-progress-bar>

        <v-list-tile-sub-title class="caption ml-2">{{ $t("cns.state.resolution") }}</v-list-tile-sub-title>
        <cns-progress-bar :ticket="request" :cnsType="'resolved'" class="mx-4"></cns-progress-bar>
      </v-container>
      <v-list-tile v-if="!drawer.mini && isEmpty(request.cns)">
        <v-layout column justify-center align-center class="mx-1">
          <v-list-tile-title class="body-1">{{ $t("Service deadlines") }}</v-list-tile-title>
          <v-list-tile-sub-title class="caption">{{
            $t("There is no service deadline for this ticket")
          }}</v-list-tile-sub-title>
        </v-layout>
      </v-list-tile>

      <v-divider class="mx-3 my-1"></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { REQUEST_TYPE, TICKET_STATUS, CNS_TYPES, ANOMALY_CNS_STATUS } from "@/constants.js";
import { capitalize, isEmpty, isEqual } from "lodash";
import ClientContractLinks from "@/components/request/ClientContractLinks";
import cnsProgressBar from "@/components/CnsProgressBar";
import UserListAssignmentNavigationDrawer from "@/components/request/UserListAssignmentNavigationDrawer";

export default {
  props: ["request", "apiUrl", "isMobile", "getUser"],
  components: {
    ClientContractLinks,
    cnsProgressBar,
    UserListAssignmentNavigationDrawer
  },
  data() {
    return {
      drawer: {
        mini: this.isMobile ? false : true
      },
      editAssignee: false,
      newResponsible: {}
    };
  },
  methods: {
    calculateCnsType({ status, type }) {
      if (!status) return TICKET_STATUS.NEW;
      if (type !== REQUEST_TYPE.ANOMALY && status === TICKET_STATUS.SUPPORTED) {
        return CNS_TYPES.RESOLUTION;
      }
      switch (status) {
        case TICKET_STATUS.NEW:
          return this.$i18n.t(ANOMALY_CNS_STATUS.new);
        case TICKET_STATUS.SUPPORTED:
          return this.$i18n.t(ANOMALY_CNS_STATUS.supported);
        case TICKET_STATUS.BYPASSED:
          return this.$i18n.t(ANOMALY_CNS_STATUS.bypassed);
        case TICKET_STATUS.RESOLVED:
          return this.$i18n.t(ANOMALY_CNS_STATUS.resolved);
        default:
          return;
      }
    },

    capitalize(value) {
      return capitalize(value);
    },

    isEmpty(value) {
      return isEmpty(value);
    },

    emitRequestNavigationDrawerStatus() {
      return this.$emit("update-request-drawer-status");
    },

    setRequestRole(user) {
      const event = { author: this.getUser, target: user };

      if (!isEmpty(this.request.assignedTo) && isEqual(this.request.assignedTo.id, user._id)) {
        return this.emitEditAssigneeStatus();
      }

      this.isSubmit = true;
      this.$store
        .dispatch("ticket/addEvent", {
          ticketId: this.request._id,
          event: event
        })
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Assignee updated"),
            color: "success"
          });
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Failed to update assignee"),
            color: "error"
          });
        })
        .finally(() => {
          this.isSubmit = false;
          this.editAssignee = false;
        });
    }
  },
  computed: {
    beneficiaryPhoneNumber() {
      if (this.request.callNumber) {
        return this.request.callNumber;
      }
      if (this.request.beneficiary && this.request.beneficiary.phone) {
        return this.request.beneficiary.phone;
      }
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
.small-icon-width {
  width: 16px;
}
.letter-spacing {
  font-size: 9px;
  letter-spacing: -1px;
  font-weight: bold;
}
.v-list__tile__avatar,
.flex {
  display: flex;
  justify-content: center;
}
.container .layout .flex,
.v-list__tile__action,
.v-list__tile__avatar {
  padding: 0 !important;
}
.v-divider .mx-3 {
  margin-left: 0 !important;
}
.v-navigation-drawer--mini-variant > .v-divider {
  margin: 0 0 16px 0;
}
.v-navigation-drawer:not(.v-navigation-drawer--mini-variant) > .v-list--two-line {
  margin-left: 16px;
}
</style>
