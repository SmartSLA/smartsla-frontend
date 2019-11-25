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
          <b>{{ $t("{days}WD {hours}WH", parseDuration(engagements.supported)) }}</b>
        </li>
        <li>
          {{ $t("Bypass") }} :
          <b>{{ $t("{days}WD {hours}WH", parseDuration(engagements.bypassed )) }}</b>
        </li>
        <li>
          {{ $t("Resolution") }} :
          <b>{{ $t("{days}WD {hours}WH", parseDuration(engagements.resolved )) }}</b>
        </li>
      </ul>
    </span>
  </v-tooltip>
</template>

<script>
import moment from "moment";

export default {
  name: "software-list-detail",
  props: {
    request: Object,
    query: String
  },
  computed: {
    engagements: function() {
      const engagements =
        this.request.software &&
        this.request.software.critical &&
        this.request.contract &&
        this.request.contract.Engagements[this.request.software.critical] &&
        this.request.contract.Engagements[this.request.software.critical].engagements;
      const severity = this.request.severity;

      const engagementFound =
        engagements &&
        engagements.find(function(engagement) {
          return engagement.severity === severity;
        });

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
      const parsedDuration = moment.duration(duration);

      return {
        days: parsedDuration.days(),
        hours: parsedDuration.hours()
      };
    }
  }
};
</script>
