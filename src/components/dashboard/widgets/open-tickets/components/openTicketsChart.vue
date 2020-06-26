<script>
//Importing Line class from the vue-chartjs wrapper
import { Line } from "vue-chartjs";
import { mapGetters } from "vuex";
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
            data: [],
            fill: false
          }
        ]
      },
      //Chart.js options that controls the appearance of the chart
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
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
    ...mapGetters({
      getUserLanguage: "configuration/getUserLanguage"
    }),
    labels() {
      return this.datasets.map(request => {
        const { year, month } = request._id;
        const date = moment().set({ year, month: month - 1, day: 1 });

        return this.$options.filters.formatDateFilter(date, "l", this.userLanguage());
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
    }
  },
  watch: {
    datasets() {
      this.renderLineChart();
    }
  }
};
</script>
