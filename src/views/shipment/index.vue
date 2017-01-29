<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">
          Shipments
        </h1>
        <hr>

        <nav class="level is-marginless">
          <div class="level-left">
            <div class="level-item">
              <filter-bar></filter-bar>
            </div>
          </div>
          <div class="level-right">
            <vuetable-pagination-info ref="paginationInfo"/>
          </div>
        </nav>
        <vuetable ref="vuetable"
          api-url="/api/v2/parcels/web"
          :css="bulmaTableCss"
          :fields="table.columns"
          :paginationPath="paginationPath"
          :data-path="dataPath"
          :sortOrder="table.sortOrder"
          detail-row-component="shipment-detail-row"
          @vuetable:cell-clicked="onCellClicked"
          @vuetable:pagination-data="onPaginationData"
        >
          <template slot="actions" scope="props">
            <button class="button is-primary" @click=""><i class="fa fa-pencil"></button>
            <button class="button is-danger" @click="deleteUser(props.rowData)"><i class="fa fa-trash"></button>
          </template>
        </vuetable>
        <bulma-pagination ref="pagination" @vuetable-pagination:change-page="onChangePage"/>
      </article>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import dataTableMixin from '../../mixins/dataTable';
import Vuetable from 'vuetable-2/src/components/Vuetable.vue';
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo';
import FilterBar from '../../components/FilterBar.vue';
import BulmaPagination from '../../components/BulmaPagination.vue';
import DetailRow from './DetailRow';
import Status from './Status';

Vue.component('shipment-detail-row', DetailRow)
Vue.component('shipment-status', Status)

export default {
  mixins: [dataTableMixin],
  components: {
    Vuetable,
    BulmaPagination,
    VuetablePaginationInfo,
    FilterBar
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
          {name: '__component:shipment-status', title: this.$t('status'), dataClass: 'has-text-centered'}
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
