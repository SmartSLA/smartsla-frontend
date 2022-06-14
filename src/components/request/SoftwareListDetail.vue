<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <text-highlight :queries="query">{{ $t(request.severity) }}</text-highlight>
      </span>
    </template>
    <span v-if="request.cns">
      <b>{{ $t("Engagements") }} {{ $t(request.severity) }} :</b>
      <ul>
        <li v-if="request.cns.supported">
          {{ $t("Support") }} :
          <b>{{ parseDuration(request.cns.supported) }}</b>
        </li>
        <li v-if="request.cns.bypassed">
          {{ $t("Bypass") }} :
          <b>{{ parseDuration(request.cns.bypassed) }}</b>
        </li>
        <li v-if="request.cns.resolved">
          {{ $t("Resolution") }} :
          <b>{{ parseDuration(request.cns.resolved) }}</b>
        </li>
      </ul>
    </span>
  </v-tooltip>
</template>

<script>
import { humanizeHoursDurationFilter } from "@/filters/humanizeHoursDurationFilter";
import { convertIsoDurationInDaysHoursMinutes } from "@/services/helpers/duration";

export default {
  name: "software-list-detail",
  props: {
    request: Object,
    query: String
  },
  methods: {
    parseDuration(cnsValue) {
      const { days, hours } = convertIsoDurationInDaysHoursMinutes(cnsValue.engagement);

      return humanizeHoursDurationFilter({ days, hours }, !cnsValue.isNonBusinessHours);
    }
  }
};
</script>
