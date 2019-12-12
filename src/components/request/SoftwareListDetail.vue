<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <text-highlight :queries="query">{{ $t(request.severity) }}</text-highlight>
      </span>
    </template>
    <span>
      <b>{{ $t("Engagements") }} {{ $t(request.severity) }} :</b>
      <ul>
        <li>
          {{ $t("Support") }} :
          <b>{{ $t("{days}wd {hours}wh", parseDuration(engagements.supported)) }}</b>
        </li>
        <li>
          {{ $t("Bypass") }} :
          <b>{{ $t("{days}wd {hours}wh", parseDuration(engagements.bypassed)) }}</b>
        </li>
        <li>
          {{ $t("Resolution") }} :
          <b>{{ $t("{days}wd {hours}wh", parseDuration(engagements.resolved)) }}</b>
        </li>
      </ul>
    </span>
  </v-tooltip>
</template>

<script>
import { getTicketSoftwareEngagement } from "@/services/helpers/ticket";

export default {
  name: "software-list-detail",
  props: {
    request: Object,
    query: String
  },
  computed: {
    engagements: function() {
      const engagementFound = getTicketSoftwareEngagement(this.request);

      const noneLabel = this.$i18n.t("None");

      return (
        engagementFound || {
          resolved: noneLabel,
          bypassed: noneLabel,
          supported: noneLabel
        }
      );
    }
  },
  methods: {
    parseDuration(duration) {
      const parsedDuration = this.moment.duration(duration);
      const days = parsedDuration
        .clone()
        .subtract({
          hours: parsedDuration.hours()
        })
        .asDays();

      return {
        days,
        hours: parsedDuration.hours()
      };
    }
  }
};
</script>
