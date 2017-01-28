<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">
          Shipments
        </h1>
        <hr>
          <data-table url="/api/v2/parcels/web" :fields="table.columns" :sortOrder="table.sortOrder" ref="table" />
      </article>
    </div>
    <modal :active="$store.getters.shipmentDetailActive" @close="closeModal" title="Details">
      <chart
        v-if="$store.getters.shipmentDetailActive"
        :type="'line'"
        :data="$store.getters.shipmentChart"
        :options="chartOptions"
      />
      <button slot="footer" type="button" class="button" @click.prevent="closeModal">Close</button>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue';
import DataTable from '../components/Table';
import Chart from '../components/Chart.vue';
import Modal from '../components/Modal.vue';

Vue.component('shipment-actions', {
  template: '<button class="button is-primary" @click="info(rowData)">Zeigen</button>',
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  },
  methods: {
    info ({id}) {
      this.$store.dispatch('getShipmentDetail', id);
    }
  }
})

export default {
  components: {
    DataTable,
    Modal,
    Chart
  },
  data() {
    return {
      table: {
        columns: [
          {name: 'tntNumber', title: this.$t('tnt'), sortField: 'tntNumber'},
          {name: 'senderCompany', title: this.$t('send_comp'), sortField: 'senderCompany'},
          {name: 'receiverCompany', title: this.$t('rcv_comp'), sortField: 'receiverCompany'},
          {name: 'dateSent', title: this.$t('date_sent'), sortField: 'dateSent', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
          {name: 'dateReceived', title: this.$t('date_received'), sortField: 'dateReceived', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
          {name: '__component:shipment-actions', title: 'Actions'}
        ],
        sortOrder: [{
          field: 'tntNumber',
          direction: 'asc'
        }]
      },
      chartOptions: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    max: 40,
                    min: 0,
                    fixedStepSize: 3
                },
                scaleLabel: {
                    display: true,
                    labelString: '°C'
                }
            }],
        },
        legend: {
            display: false
        },
        horizontalLine: [{
            y: 25,
            style: "#FFA100",
        }, {
            y: 15,
            style: "#25A9E1",
        }],
        pan: {
            // Boolean to enable panning
            enabled: true,
            // Panning directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow panning in the y direction
            mode: 'xy'
        },
        // Container for zoom options
        zoom: {
            // Boolean to enable zooming
            enabled: true,
            // Zooming directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow zooming in the y direction
            mode: 'xy'
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.$store.commit('resetShipmentDetail');
    }
  }
}
</script>
