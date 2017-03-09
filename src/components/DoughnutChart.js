import { Doughnut, mixins } from 'vue-chartjs'

export default Doughnut.extend({
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: false
        }
      })
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})
