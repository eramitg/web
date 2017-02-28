<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">Shipments</h1>
        <hr>
        <data-table
          url="v2/parcels/web"
          :fields="table.columns"
          :sortOrder="table.sortOrder"
          row-component="shipment-detail-row"
        >
        <template slot="transit" scope="props">
          {{computeTransitTime(props.rowData)}}
        </template>
        </data-table>
      </article>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import DataTable from '../../components/DataTable'
import DetailRow from './DetailRow'
import Status from './Status'

Vue.component('shipment-detail-row', DetailRow)
Vue.component('shipment-status', Status)

export default {
  components: {
    DataTable
  },
  data () {
    return {
      table: {
        columns: [
          {name: 'tntNumber', title: this.$t('tnt'), sortField: 'tntNumber'},
          {name: 'senderCompany', title: this.$t('send_comp'), sortField: 'senderCompany'},
          {name: 'receiverCompany', title: this.$t('rcv_comp'), sortField: 'receiverCompany'},
          {name: 'dateSent', title: this.$t('date_sent'), sortField: 'dateSent', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
          {name: 'dateReceived', title: this.$t('date_received'), sortField: 'dateReceived', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
          {name: '__slot:transit', title: this.$t('transit')},
          {name: '__component:shipment-status', title: this.$t('status'), dataClass: 'has-text-centered'}
        ],
        sortOrder: [{
          field: 'dateReceived',
          direction: 'desc'
        }]
      }
    }
  },
  methods: {
    computeTransitTime ({dateSent, dateReceived}) {
      let diff = moment(dateReceived).diff(moment(dateSent), 'hour', true).toFixed(1)
      if (diff > 0) {
        return `${diff}h`
      } else {
        return 'n/a'
      }
    }
  }
}
</script>
