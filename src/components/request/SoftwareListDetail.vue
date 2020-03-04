<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <text-highlight :queries="query">{{ $t(request.severity) }}</text-highlight>
      </span>
    </template>
    <span v-if="request.cns.supported">
      <b>{{ $t("Engagements") }} {{ $t(request.severity) }} :</b>
      <ul>
        <li>
          {{ $t("Support") }} :
          <b>{{ parseDuration(request.cns.supported) }}</b>
        </li>
        <li>
          {{ $t("Bypass") }} :
          <b>{{ parseDuration(request.cns.bypassed) }}</b>
        </li>
        <li>
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
