<template>
  <div class="mt-2">
    <v-btn flat fab small color="default" @click="exportData">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">backup</v-icon>
        </template>
        <span>{{ $t("Export sheet (CSV)") }}</span>
      </v-tooltip>
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
