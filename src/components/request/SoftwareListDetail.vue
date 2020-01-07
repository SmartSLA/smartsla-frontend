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
          <b>{{ parseDuration(engagements.supported) }}</b>
        </li>
        <li>
          {{ $t("Bypass") }} :
          <b>{{ parseDuration(engagements.bypassed) }}</b>
        </li>
        <li>
          {{ $t("Resolution") }} :
          <b>{{ parseDuration(engagements.resolved) }}</b>
        </li>
      </ul>
    </span>
  </v-tooltip>
</template>

<script>
import { getTicketSoftwareEngagement } from "@/services/helpers/ticket";
import { humanizeHoursDurationFilter } from "@/filters/humanizeHoursDurationFilter";
import { convertIsoDurationInDaysHoursMinutes } from "@/services/helpers/duration";

export default {
  name: "software-list-detail",
  props: {
    request: Object,
    query: String
  },
  computed: {
    engagements: function() {
      return getTicketSoftwareEngagement(this.request);
    }
  },
  methods: {
    parseDuration(engagement) {
      const { days, hours } = convertIsoDurationInDaysHoursMinutes(engagement.hours);

      return humanizeHoursDurationFilter({ days, hours }, engagement.businessHours);
    }
  }
};
</script>
