<template>
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
          <chart :type="'bar'" :data="pieData" :options="barOptions"></chart>
        </article>
      </div>
      <div class="tile is-parent is-4" v-if="parcels">
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
          vm.$data.parcels = data
        })
      } catch (e) {
        next()
      }
    },
    data () {
      return {
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
          labels: this.labels,
          datasets: [{
            data: [this.okParcels, this.nokParcels, this.pendingParcels],
            backgroundColor: this.backgroundColor
          }]
        }
      }
    }
  }
</script>
