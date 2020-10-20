<script>
//Importing Line class from the vue-chartjs wrapper
import { Line } from "vue-chartjs";
import { mapGetters, mapState } from "vuex";
import moment from "moment-timezone";
import { LOCALE } from "@/i18n/constants";

//Exporting this so it can be used in other components
export default {
  extends: Line,
  data() {
    return {
      datacollection: {
        //Data to be represented on x-axis
        labels: [],
        datasets: [
          {
            label: this.$t("openedTickets"),
            type: "bar",
            order: 1,
            borderColor: "rgb(142, 171, 104, 1)",
            backgroundColor: "#afccee",
            data: [],
            fill: false
          },
          {
            label: this.$t("closedTickets"),
            type: "line",
            order: 0,
            borderColor: "rgb(255, 99, 132)",
            pointBackgroundColor: "white",
            backgroundColor: "rgb(255, 99, 132)",
            data: [],
            fill: false
          }
        ]
      },
      //Chart.js options that controls the appearance of the chart
      options: {
        plugins: {
          datalabels: {
            labels: {
              value: {
                font: { size: 12, weight: "bold" }
              }
            },
            borderRadius: 4,
            backgroundColor: function(context) {
              let chartType = context.dataset.type;

              return chartType === "line" ? context.dataset.backgroundColor : null;
            },
            display: function(context) {
              return context.dataset.data[context.dataIndex] > 0;
            },
            color: function(context) {
              let chartType = context.dataset.type;

              return chartType === "bar" ? "black" : "white";
            }
          }
        },
        scales: {
          yAxes: [
            {
              stacked: true
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
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
          text: this.$t("chartTitleOpenTickets")
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
      this.datacollection.datasets[0].data = this.openedRequests;
      this.datacollection.datasets[1].data = this.closedRequests;

      this.renderChart(this.datacollection, this.options);
    }
  },
  mounted() {
    this.renderLineChart(this.datacollection, this.options);
  },
  computed: {
    ...mapState("main", ["filters"]),
    ...mapGetters({
      getUserLanguage: "configuration/getUserLanguage"
    }),
    labels() {
      const dates = this.datasets.map(request => {
        const { year, month, day, quarter, week } = request._id;

        if (quarter) {
          return `${this.$i18n.t("quarter").charAt(0)}${quarter}-${year}`;
        }

        if (week) {
          return `${this.$i18n.t("week").charAt(0)}${week}-${year}`;
        }

        return moment().set({ year, month: month - 1 || 0, date: day || 1 });
      });

      return dates
        .sort((a, b) => a - b)
        .map(date => {
          if (moment(date).isValid()) {
            return this.$options.filters.formatDateFilter(date, this.labelDates, this.userLanguage);
          }
          return date;
        });
    },
    openedRequests() {
      return this.datasets.map(request => request.open);
    },
    closedRequests() {
      return this.datasets.map(request => request.closed);
    },
    userLanguage() {
      return this.getUserLanguage || LOCALE;
    },
    labelDates() {
      if (this.filters.group === "day") {
        return "D MMM YYYY";
      }
      return "MMM YYYY";
    }
  },
  watch: {
    datasets() {
      this.renderLineChart();
    }
  }
};
</script>
