<template>
  <div v-if="parcels">
    <div class="tile is-ancestor" v-if="parcels">
      <div class="tile is-parent is-one-quarter">
        <card class="tile is-child has-text-centered">
          <p class="heading">Total Sendungen verschickt</p>
          <p class="title">{{parcels.totalSentParcels}}</p>
        </card>
      </div>
      <div class="tile is-parent is-one-quarter">
        <card type="success" class="tile is-child has-text-centered">
          <p class="heading">Total Sendungen OK</p>
          <p class="title">{{parcels.temperaturesOkSentParcels}}</p>
        </card>
      </div>
      <div class="tile is-parent is-one-quarter">
        <card type="danger" class="tile is-child has-text-centered">
          <p class="heading">Anzahl Abweichungen</p>
          <p class="title">{{parcels.temperaturesNOkSentParcels}}</p>
        </card>
      </div>
      <div class="tile is-parent is-one-quarter">
        <card type="warning" class="tile is-child has-text-centered">
          <p class="heading"># Sendungen unterwegs</p>
          <p class="title">{{parcels.onTheWaySentParcel}}</p>
        </card>
      </div>
    </div>

    <div class="tile is-ancestor" v-if="parcels">
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <chart :type="'bar'" :data="pieData" :options="options"></chart>
        </article>
      </div>
      <div class="tile is-parent is-6" v-if="parcels">
        <article class="tile is-child box">
          <chart :type="'doughnut'" :data="pieData" :options="options"></chart>
        </article>
      </div>
    </div>
  </div>
  <div v-else>
    Make sure you have an internet connection
  </div>
</template>

<script>
  import Card from '../components/Card.vue';
  import Chart from '../components/Chart.vue';
  import DataTable from '../components/DataTable.vue';
  import axios from 'axios';
  import moment from 'moment';

  export default {
    components: {
      Card,
      Chart,
      DataTable
    },
    async beforeRouteEnter(to, from, next) {
      let {data} = await axios.get("/api/statistics");
      next(vm => vm.$data.parcels = data);
    },
    data(){
      return {
        parcels: null,
        labels: ['Total Sendungen OK', 'Anzahl Abweichungen', '# Sendungen unterwegs'],
        data: [20, 40, 5, 35],
        options: {
          legend: {
            display: false
           }
        },
        optionsData: {
          skin: 'is-striped',
          headings:{
            tnt: 'Just Something'
          }
        },
        backgroundColor: [
          '#23D160',
          '#FF3860',
          '#FFDD57'
        ],
       }
    },
    computed: {
      totalParcels(){
        return  0;
      },
      totalOk(){
        return  0;
      },
      totalNotArrived(){
        return 0;
      },
      totalOnWay(){
        return 0;
      },
      momentParcels(){
        return this.parcels ?
        this.parcels.map(item => {
          item.dateSent = moment(item.dateSent).format('DD.MM.YYYY, HH:mm');
          item.dateReceived = moment(item.dateReceived).format('DD.MM.YYYY, HH:mm');
          return item
        })
        : []
      },
      pieData () {
        return {
          labels: this.labels,
          datasets: [{
            data: [this.parcels.temperaturesOkSentParcels, this.parcels.temperaturesNOkSentParcels, this.parcels.onTheWaySentParcel],
            backgroundColor: this.backgroundColor
          }]
         }
        },
    }
  }
</script>