<template>
  <div>
    <span v-if="request.type === 'softwareVulnerability' && request.vulnInfos">
      #{{ request._id }} -
      {{
        $t("Vulnerability detected: {CveId} on {softwareName} v-{softwareVersion}", {
          CveId: request.vulnInfos.CveId,
          softwareName: request.software && request.software.software && request.software.software.name,
          softwareVersion: request.software && request.software.version
        })
      }}
    </span>
    <span v-else> #{{ request._id }} - {{ request.title }}</span>
    <small v-if="request.archived" class="archived"> {{ $t("Archived") }} </small>
  </div>
</template>

<script>
export default {
  name: "request-title",
  props: {
    request: Object
  }
};
</script>
<style lang="stylus" scoped></style>
