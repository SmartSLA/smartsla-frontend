<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <span v-on="on">{{ request.severity }}</span>
    </template>
    <span>
      <b>{{ $t("Engagements") }} {{ request.severity }} :</b>
      <ul>
        <li>
          {{ $t("Support") }} :
          <b>{{ engagements.supported }}</b>
        </li>
        <li>
          {{ $t("Bypass") }} :
          <b>{{ engagements.bypassed }}</b>
        </li>
        <li>
          {{ $t("Resolution") }} :
          <b>{{ engagements.resolved }}</b>
        </li>
      </ul>
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: "software-list-detail",
  props: {
    request: Object
  },
  computed: {
    engagements: function() {
      const engagements =
        this.request.software &&
        this.request.software.critical &&
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
  }
};
</script>
