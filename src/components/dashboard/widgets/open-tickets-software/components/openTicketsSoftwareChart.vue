<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  data() {
    return {
      datacollection: {
        labels: [],
        datasets: [
          {
            type: "pie",
            data: []
          }
        ]
      },
      options: {
        plugins: {
          datalabels: {
            labels: {
              value: {
                align: "center",
                backgroundColor: function(ctx) {
                  return ctx.dataset.backgroundColor;
                },
                color: function(ctx) {
                  const bg = ctx.dataset.backgroundColor[ctx.dataIndex].split("#")[1];
                  let r = parseInt(bg.substr(0, 2), 16);
                  let g = parseInt(bg.substr(2, 2), 16);
                  let b = parseInt(bg.substr(4, 2), 16);
                  let yiq = (r * 299 + g * 587 + b * 114) / 1000;
                  return yiq >= 128 ? "black" : "white";
                }
              }
            },
            font: { weight: "bold" }
          }
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false,
        lineTension: 1,
        title: {
          display: true,
          position: "bottom",
          text: this.$t("chartTitleTicketsSoftware")
        }
      }
    };
  },
  props: {
    datasets: {
      type: Array
    }
  },
  methods: {
    renderLineChart() {
      this.datacollection.labels = this.labels;
      this.datacollection.datasets[0].data = this.ticketCounter;
      this.datacollection.datasets[0].backgroundColor = this.colors;

      this.renderChart(this.datacollection, this.options);
    },
    generateColors() {
      return `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
    }
  },
  mounted() {
    this.renderLineChart(this.datacollection, this.options);
  },
  computed: {
    labels() {
      return this.datasets.map(software => software.softwareName);
    },
    ticketCounter() {
      return this.datasets.map(software => software.ticketCount);
    },
    colors() {
      return this.datasets.map(() => this.generateColors());
    }
  },
  watch: {
    datasets() {
      this.renderLineChart();
    }
  }
};
</script>
