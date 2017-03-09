<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-half">
        <article class="tile is-child box">
          <label class="label">From Date:</label>
          <p class="control">
            <date-picker v-model="start" @input.lazy="updateStatistics"/>
          </p>
        </article>
      </div>
      <div class="tile is-parent is-half">
        <article class="tile is-child box">
          <label class="label">To Date:</label>
          <p class="control">
          <date-picker v-model="end" @input.lazy="updateStatistics"/>
          </p>
        </article>
      </div>
    </div>
    <div v-if="parcels">
      <div class="tile is-ancestor" v-if="parcels">
        <div class="tile is-parent is-one-quarter">
          <card type="white" class="tile is-child has-text-centered">
            <p class="heading">{{$t('total_shipment')}}</p>
            <p class="title">{{this.totalParcels}}</p>
          </card>
        </div>
        <div class="tile is-parent is-one-quarter">
          <card type="success" class="tile is-child has-text-centered">
            <p class="heading">{{$t('shipment_ok')}}</p>
            <p class="title">{{this.okParcels}}</p>
          </card>
        </div>
        <div class="tile is-parent is-one-quarter">
          <card type="danger" class="tile is-child has-text-centered">
            <p class="heading">{{$t('deviations')}}</p>
            <p class="title">{{this.nokParcels}}</p>
          </card>
        </div>
        <div class="tile is-parent is-one-quarter">
          <card type="warning" class="tile is-child has-text-centered">
            <p class="heading">{{$t('shipment_transit')}}</p>
            <p class="title">{{parcels.pendingParcels}}</p>
          </card>
        </div>
      </div>

      <div class="tile is-ancestor" v-if="parcels">
        <div class="tile is-parent is-8">
          <article class="tile is-child box">
            <bar-chart :chartData="pieData"/>
          </article>
        </div>
        <div class="tile is-parent is-4" v-if="parcels">
          <article class="tile is-child box">
            <doughnut-chart :chartData="pieData"/>
          </article>
        </div>
      </div>
    </div>
    <div v-else>
      <span>Nothing Found</span>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import Vue from 'vue'
  import Card from '../components/Card.vue'
  import Chart from '../components/Chart.vue'
  import DatePicker from '../components/DatePicker.vue'
  import Plotly from '../components/Plotly.vue'
  import BarChart from '../components/BarChart'
  import DoughnutChart from '../components/DoughnutChart'

  export default {
    components: {
      Card,
      Chart,
      DatePicker,
      Plotly,
      BarChart,
      DoughnutChart
    },
    async beforeRouteEnter (to, from, next) {
      let start = '01/01/2016'
      let end = moment().format('DD/MM/YYYY')
      let {data} = await Vue.http.get('statistics', {
        params: {start, end}
      })
      next(vm => {
        vm.$data.parcels = data
      })
    },
    data () {
      return {
        start: '01/01/2016',
        end: moment().format('DD/MM/YYYY'),
        parcels: null,
        labels: ['Total Sendungen OK', 'Anzahl Abweichungen', '# Sendungen unterwegs'],
        backgroundColor: [
          '#26BA9A',
          '#D8544F',
          '#EFAC4D'
        ],
        barOptions: {
          legend: {display: false},
          zoom: {enabled: false},
          scales: {
            yAxes: [
              {display: true, ticks: {beginAtZero: true}}
            ]
          }
        }
      }
    },
    computed: {
      totalParcels () {
        return this.parcels ? this.parcels.totalParcels : 0
      },
      okParcels () {
        return this.parcels ? this.parcels.okParcels : 0
      },
      nokParcels () {
        return this.parcels ? this.parcels.nokParcels : 0
      },
      pendingParcels () {
        return this.parcels ? this.parcels.pendingParcels : 0
      },
      pieData () {
        return {
          labels: [this.$t('shipment_ok'), this.$t('deviations'), this.$t('shipment_transit')],
          datasets: [{
            data: [this.okParcels, this.nokParcels, this.pendingParcels],
            backgroundColor: this.backgroundColor
          }]
        }
      }
    },
    methods: {
      async updateStatistics () {
        try {
          let {data} = await this.$http.get('statistics', {params: {
            start: this.start,
            end: this.end
          }})
          this.parcels = data
        } catch ({data}) {
          this.$store.dispatch('notify', {text: data.message, type: 'danger'})
        }
      }
    }
  }
</script>
