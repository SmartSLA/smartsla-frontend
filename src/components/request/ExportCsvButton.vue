<template>
  <div>
    <v-btn flat small color="default" @click="exportData">
      <v-icon class="mr-2">backup</v-icon> {{ $t("Export sheet") }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ExportCsvButton",
  methods: {
    exportData() {
      const fileName = `08000linux_${this.moment().format("YYYY_MM_DD")}.csv`;

      this.$store.dispatch("ticket/exportTickets").then(({ data }) => {
        var fileURL = window.URL.createObjectURL(new Blob([data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName);
        document.body.appendChild(fileLink);
        fileLink.click();
      });
    }
  }
};
</script>
