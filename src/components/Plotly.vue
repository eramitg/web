<template>
  <div class="js-plotly-plot" ref="chart"></div>
</template>

<script>
import Plotly from 'plotly.js'
export default {
  props: {
    data: {
      type: Array,
      required: true,
      default: () => ([])
    },
    layout: {
      type: Object,
      default: () => ({})
    },
    config: {
      type: Object,
      default: () => ({
        modeBarButtonsToRemove: ['sendDataToCloud', 'hoverCompareCartesian'],
        displaylogo: false
      })
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    }
  },
  mounted () {
    this.chart = Plotly.plot(
      this.$el,
      this.data,
      this.layout,
      this.config
    )
  },
  data () {
    return {
      chart: null
    }
  },
  computed: {
    finalLayout () {
      let {x} = this.data[0]
      let layout = {...this.layout}
      layout.shapes = []

      // console.log(this.data)
      if (x && x.length > 0) {
        let start = x[0]
        let end = x[x.length - 1]
        if (this.min !== null) layout.shapes.push(this.horizontalLine(start, end, this.min, '#25A9E1'))
        if (this.max !== null) layout.shapes.push(this.horizontalLine(start, end, this.max, '#FFA100'))
      }
      return layout
    }
  },
  methods: {
    horizontalLine (x0, x1, y, color = 'rgb(0, 0, 0)') {
      this
      return {
        type: 'line',
        x0: x0,
        y0: y,
        x1: x1,
        y1: y,
        line: {color, width: 4, dash: 'dot'}
      }
    }
  },
  watch: {
    finalLayout: {
      handler (val) {
        this.$nextTick(() => {
          Plotly.relayout(this.$refs.chart, val)
        })
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.js-plotly-plot {
  max-width: 100%;
}
</style>
