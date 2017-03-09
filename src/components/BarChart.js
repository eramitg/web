import { Bar, mixins } from 'vue-chartjs'

export default Bar.extend({
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
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {barThickness: 100}
          ]
        }
      })
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})
