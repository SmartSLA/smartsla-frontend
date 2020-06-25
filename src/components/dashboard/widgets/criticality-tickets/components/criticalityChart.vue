<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: {
    datasets: {
      type: Array
    }
  },
  data: () => ({
    chartData: {
      labels: ["Demande d'informations", "Anomalie non bloquante", "Anomalie bloquante"],
      datasets: [
        {
          label: "Critical",
          data: [3, 6, 14],
          backgroundColor: "#D32F2F"
        },
        {
          label: "Not Critical",
          backgroundColor: "#42A5F5",
          data: [4.8, 12.1, 49.2]
        }
      ]
    },
    chartOptions: {
      title: {
        display: true,
        position: "left",
        fontColor: "#5e5252",
        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        fontSize: 15
      },
      responsive: true,
      maintainAspectRatio: false,
      lineTension: 1
    }
  }),
  mounted() {
    this.renderBarChart(this.chartData, this.chartOptions);
  },
  methods: {
    renderBarChart() {
      const { labels, criticalCounter, notCriticalCounter } = this.chartValues;

      this.chartOptions.title.text = this.$t("chartTitle");
      this.chartData.labels = labels;
      this.chartData.datasets[0].data = criticalCounter;
      this.chartData.datasets[1].data = notCriticalCounter;

      this.renderChart(this.chartData, this.chartOptions);
    }
  },
  computed: {
    chartValues() {
      const element = this.datasets[0];
      let labels = [];
      let criticalCounter = [];
      let notCriticalCounter = [];

      Object.keys(element).map(type => {
        if (type !== "_id") {
          labels.push(this.$t(type));
          criticalCounter.push(element[type].critical || 0);
          notCriticalCounter.push(element[type].nonCritical || 0);
        }
      });

      return { labels, criticalCounter, notCriticalCounter };
    }
  },
  watch: {
    datasets() {
      this.renderBarChart();
    }
  }
};
</script>
