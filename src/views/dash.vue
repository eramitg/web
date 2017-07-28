<template>
  <div v-if="statistics">
    <div class="tile is-ancestor" v-if="statistics">
      <div class="tile is-parent is-one-quarter">
        <router-link class="tile is-child has-text-centered" :to="{name: 'Shipments'}">
          <card type="white">
            <p class="heading">{{$t('total_shipment')}}</p>
            <p class="title">{{this.shipmentsTotal}}</p>
          </card>
        </router-link>
      </div>
      <div class="tile is-parent is-one-quarter">
        <router-link class="tile is-child has-text-centered" :to="{name: 'Shipments', query: {status: [1, 3]}}">
          <card type="success" style="background-color: #48c092 !important;">
            <p class="heading">{{$t('shipment_ok')}}</p>
            <p class="title">{{this.shipmentsOK}}</p>
          </card>
        </router-link>
      </div>
      <div class="tile is-parent is-one-quarter">
        <router-link class="tile is-child has-text-centered" :to="{name: 'Shipments', query: {status: [2, 4]}}">
          <card type="danger" style="background-color: #f79010 !important;">
            <p class="heading">{{$t('deviations')}}</p>
            <p class="title">{{this.shipmentsNOK}}</p>
          </card>
        </router-link>
      </div>
      <div class="tile is-parent is-one-quarter">
        <router-link class="tile is-child has-text-centered" :to="{name: 'Shipments', query: {status: 0}}">
          <card type="warning" style="background-color: #454aa7 !important;">
            <p class="heading">{{$t('shipment_transit')}}</p>
            <p class="title">{{this.shipmentsInTransit}}</p>
          </card>
        </router-link>
      </div>
    </div>

    <div class="tile is-ancestor" v-if="statistics">
      <div class="tile is-parent is-8">
        <article class="tile is-child box">
          <chart :type="'bar'" :data="pieData" :options="barOptions"></chart>
        </article>
      </div>
      <div class="tile is-parent is-4" v-if="statistics">
        <article class="tile is-child box">
          <chart :type="'doughnut'" :data="pieData"></chart>
        </article>
      </div>
    </div>
  </div>
  <div v-else>
    No statistics to show yet
  </div>
</template>

<script>
  import Vue from 'vue'
  import Card from '../components/Card.vue'
  import Chart from '../components/Chart.vue'

  export default {
    components: {
      Card,
      Chart
    },
    async beforeRouteEnter (to, from, next) {
      try {
        let {data} = await Vue.http.get('statistics')
        next(vm => {
          vm.$data.statistics = data
        })
      } catch (e) {
        next()
      }
    },
    data () {
      return {
        statistics: null,
        labels: ['Total Sendungen OK', 'Total Sendungen nicht OK', 'total Sendungen unterwegs'],
        backgroundColor: [
          '#48c092',
          '#f79010',
          '#454aa7'
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
      shipmentsTotal () {
        try {
          return this.statistics ? this.statistics.shipmentsTotal : 0
        } catch (e) {
          return 0
        }
      },
      shipmentsOK () {
        try {
          return this.statistics ? this.statistics.shipmentsOK : 0
        } catch (e) {
          return 0
        }
      },
      shipmentsNOK () {
        try {
          return this.statistics ? this.statistics.shipmentsNOK : 0
        } catch (e) {
          return 0
        }
      },
      shipmentsInTransit () {
        try {
          return this.statistics ? this.statistics.shipmentsInTransit : 0
        } catch (e) {
          return 0
        }
      },
      pieData () {
        return {
          labels: [this.$t('shipment_ok'), this.$t('deviations'), this.$t('shipment_transit')],
          datasets: [{
            data: [this.shipmentsOK, this.shipmentsNOK, this.shipmentsInTransit],
            backgroundColor: this.backgroundColor
          }]
        }
      }
    }
  }
</script>
