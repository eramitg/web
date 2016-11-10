<template>
  <div>
    <nav class="level">
      <div class="level-item has-text-centered">
        <p class="heading">Total Sendungen verschickt</p>
        <p class="title count">{{totalParcels}}</p>
      </div>
      <div class="level-item has-text-centered">
        <p class="heading">Total Sendungen OK</p>
        <p class="title success">{{totalOk}}</p>
      </div>
      <div class="level-item has-text-centered">
        <p class="heading">Anzahl Abweichungen</p>
        <p class="title danger">{{totalNotArrived}}</p>
      </div>
      <div class="level-item has-text-centered">
        <p class="heading"># Sendungen unterwegs</p>
        <p class="title info">{{totalOnWay}}</p>
      </div>
    </nav>

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
    <div class="tile is-ancestor" v-if="parcels">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <data-table :data="parcels" :columns="table.columns" :options="table.options"></data-table>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
  import Chart from '../components/Chart.vue';
  import DataTable from '../components/DataTable.vue';
  import axios from 'axios';
  import i18 from '../i18';

  export default {
    components: {
      Chart,
      DataTable
    },
    async beforeRouteEnter(to, from, next) {
      let {data} = await axios.get("/api/v2/parcels/web");
      next(vm => vm.$data.parcels = data);
    },
    data(){
      return {
        parcels: null,
        table: {
          columns: ['tntNumber', 'senderCompany', 'receiverCompany', 'dateSent', 'dateReceived', 'details'],
          options: {
            headings: {
              tntNumber: i18.t('tnt'),
              senderCompany: i18.t('send_comp'),
              receiverCompany: i18.t('rcv_comp'),
              dateSent: i18.t('date_sent'),
              dateReceived: i18.t('date_received')
            },
            templates: {
              details: function(h, row) {
                return <button id={row.id} class="button">Zeigen</button>
              }
            }
          }
        },
        labels: ['Sleeping', 'Designing', 'Coding', 'Cycling'],
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
        return this.parcels ? this.parcels.length : 0;
      },
      totalOk(){
        return this.parcels ? this.parcels.filter(parcel => parcel.isSuccess).length : 0;
      },
      totalNotArrived(){
        return this.parcels ? this.parcels.filter(parcel => parcel.isFailed).length : 0;
      },
      totalOnWay(){
        return this.parcels ? this.parcels.filter(parcel => parcel.isSent && !parcel.isReceived).length : 0;
      },
      pieData () {
        return {
          labels: this.labels,
          datasets: [{
            data: [this.totalOk, this.totalNotArrived, this.totalOnWay],
            backgroundColor: this.backgroundColor
          }]
         }
        },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../variables";

  .count{
    font-weight: 600;
  }

  .success{
    @extend .count;
    color: $success;
  }
  .danger{
    @extend .count;
    color: $danger;
  }
  .info{
    @extend .count;
    color: $yellow;
  }
</style>