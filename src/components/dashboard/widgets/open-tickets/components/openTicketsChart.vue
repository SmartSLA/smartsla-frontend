<script>
//Importing Line class from the vue-chartjs wrapper
import { Line } from "vue-chartjs";
import moment from "moment-timezone";

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
            label: "Tickets ouverts",
            type: "bar",
            order: 1,
            borderColor: "rgb(142, 171, 104, 1)",
            backgroundColor: "#afccee",
            data: [],
            fill: false
          },
          {
            label: "Tickets résolus",
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
          text: "Total des tickets ouverts & tickets résolus"
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
    labels() {
      return this.datasets.map(request => this.$options.filters.formatDateFilter(moment(request._id), "ll"));
    },
    openedRequests() {
      return this.datasets.map(request => request.open);
    },
    closedRequests() {
      return this.datasets.map(request => request.closed);
    }
  },
  watch: {
    datasets() {
      this.renderLineChart();
    }
  }
};
</script>
