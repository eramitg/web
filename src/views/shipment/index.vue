<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">
          Shipments
        </h1>
        <hr>
        <data-table url="/api/v2/parcels/web" :fields="table.columns" :sortOrder="table.sortOrder" row="shipment-detail-row" ref="table" />
      </article>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import DetailRow from './DetailRow';
import DataTable from '../../components/Table';

Vue.component('shipment-detail-row', DetailRow)

export default {
  components: {
    DetailRow,
    DataTable,
  },
  data() {
    return {
      table: {
        columns: [
          {name: 'tntNumber', title: this.$t('tnt'), sortField: 'tntNumber'},
          {name: 'senderCompany', title: this.$t('send_comp'), sortField: 'senderCompany'},
          {name: 'receiverCompany', title: this.$t('rcv_comp'), sortField: 'receiverCompany'},
          {name: 'dateSent', title: this.$t('date_sent'), sortField: 'dateSent', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
          {name: 'dateReceived', title: this.$t('date_received'), sortField: 'dateReceived', callback: 'formatDate|DD.MM.YYYY, HH:mm'}
        ],
        sortOrder: [{
          field: 'tntNumber',
          direction: 'asc'
        }]
      },
    }
  }
}
</script>
