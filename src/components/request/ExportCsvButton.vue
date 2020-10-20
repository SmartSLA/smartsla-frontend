<template>
  <div class="mt-2">
    <v-btn flat fab small color="default" @click="exportData">
      <v-icon>backup</v-icon>
    </v-btn>
  </div>
</template>

<script>
import ApplicationSettings from "@/services/application-settings";

export default {
  name: "ExportCsvButton",
  methods: {
    exportData() {
      const fileName = `${ApplicationSettings.SUPPORT_ACCOUNT.name}_${this.moment().format("YYYY_MM_DD")}.csv`;

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
