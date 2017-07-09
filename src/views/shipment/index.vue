<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">Shipments</h1>
        <hr>
        <data-table
          url="shipments?nested=2"
          :fields="table.columns"
          :sortOrder="table.sortOrder"
          :query="table.query"
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
          {name: '__component:shipment-status', title: this.$t('status'), titleClass: 'fix-width', dataClass: 'vertical-centered has-text-centered', sortField: 'status'},
          {name: 'tnt', title: this.$t('tnt'), sortField: 'tnt'},
          {name: 'sender.company.name', title: this.$t('send_comp')},
          {name: 'receiver.company.name', title: this.$t('rcv_comp')},
          {name: 'sent', title: this.$t('date_sent'), sortField: 'sent', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
          {name: 'received', title: this.$t('date_received'), sortField: 'received', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
          {name: '__slot:transit', title: this.$t('transit')}
        ],
        sortOrder: [{
          field: 'updatedAt',
          direction: 'desc'
        }],
        query: [
          {
            name: this.$t('status'),
            field: 'status',
            options: [
              {label: 'In Transit', value: 0},
              {label: 'Received Success', value: 1},
              {label: 'Received Failure', value: 2},
              {label: 'Mined Success', value: 3},
              {label: 'Mined Failure', value: 4},
              {label: 'Conflict', value: 5}
            ]
          },
          {name: this.$t('tnt'), field: 'tnt'}
        ]
      }
    }
  },
  methods: {
    computeTransitTime ({sent, received}) {
      let diff = moment(received).diff(moment(sent), 'hour', true).toFixed(1)
      if (diff > 0) {
        return `${diff}h`
      } else {
        return 'n/a'
      }
    }
  }
}
</script>

<style lang="scss">
  .fix-width{
    width: 70px;
    text-align: center !important;
  }

  .vertical-centered{
    vertical-align: middle;
  }
</style>
