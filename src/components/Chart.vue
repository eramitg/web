<template>
    <canvas class="chartjs" :width="width" :height="height"></canvas>
</template>

<script>
import Chart from 'chart.js' // With moment.js
// import 'Chart.Zoom.js'
const types = ['line', 'bar', 'radar', 'polarArea', 'pie', 'doughnut']

/* var horizonalLinePlugin = {
  beforeDraw: function (chartInstance) {
    var yScale = chartInstance.scales['y-axis-0']
    var canvas = chartInstance.chart
    var ctx = canvas.ctx
    var index
    var line
    var style
    if (chartInstance.options.horizontalLine) {
      for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {
        line = chartInstance.options.horizontalLine[index]
        if (!line.style) {
          style = 'rgba(169,169,169, .6)'
        } else {
          style = line.style
        }
        var yValue = ''
        if (line.y) {
          yValue = yScale.getPixelForValue(line.y)
        } else {
          yValue = 0
        }
        ctx.lineWidth = 3
        if (yValue) {
          ctx.beginPath()
          ctx.moveTo(0, yValue)
          ctx.lineTo(canvas.width, yValue)
          ctx.strokeStyle = style
          ctx.stroke()
        }
      }
      return
    }
  }
} */
// Chart.pluginService.register(horizonalLinePlugin)

export default {
  props: {
    width: Number,
    height: Number,
    type: {
      type: String,
      required: true,
      validator: val => types.includes(val)
    },
    data: {
      type: Object,
      required: true,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({
        legend: {
          display: false
        },
        zoom: {
          enabled: false
        }
      })
    },
    horizontalLine: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.chart = new Chart(this.$el, {
      type: this.type,
      data: this.data,
      options: this.options
    })
  },
  data () {
    return {
      chart: null
    }
  },
  methods: {
    resetChart () {
      this.$nextTick(() => {
        this.chart.destroy()
        this.chart = new Chart(this.$el, {
          type: this.type,
          data: this.data,
          options: this.options
        })
      })
    }
  },
  watch: {
    type () {
      this.resetChart()
    },
    data () {
      this.$nextTick(() => {
        this.chart.update()
      })
    },
    options () {
      this.resetChart()
    }
  }
}
</script>

<style lang="scss" scoped>
    canvas.chartjs {
        max-width: 100%
    }
</style>
