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
              index: {
                align: "end",
                anchor: "end",
                formatter: function(value) {
                  return value;
                },
                color: function(ctx) {
                  return ctx.dataset.backgroundColor;
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
          text: this.$t("chartTitleTicketsSoftware"),
          padding: 30
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

      this.addPlugin({
        id: "spacer",
        beforeInit: function(chart) {
          chart.legend.afterFit = function() {
            this.height = this.height + 20;
          };
        }
      });

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
