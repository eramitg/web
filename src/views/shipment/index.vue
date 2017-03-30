<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-12">
      <article class="tile is-child box">
        <h1 class="title">Shipments</h1>
        <hr>
        <data-table
          ref="vuetable"
          url="v2/parcels/web"
          :fields="table.columns"
          :sortOrder="table.sortOrder"
          :additionalParams="moreParams"
          row-component="shipment-detail-row"
        >
        <slot>
          <form-select :options="possibleStatus" :value="status" @input="updateStatus"></form-select>
        </slot>
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
import FormSelect from '../../components/FormSelect'
import DataTable from '../../components/DataTable'
import DetailRow from './DetailRow'
import Status from './Status'

Vue.component('shipment-detail-row', DetailRow)
Vue.component('shipment-status', Status)

export default {
  components: {
    DataTable,
    FormSelect
  },
  data () {
    return {
      status: '-1',
      possibleStatus: [
        {label: 'All Status', value: '-1'},
        {label: 'In Transit', value: '0'},
        {label: 'ReceivedSuccess', value: '1'},
        {label: 'ReceivedFailure', value: '2'},
        {label: 'MinedSuccess', value: '3'},
        {label: 'MinedFailure', value: '4'},
        {label: 'Conflict', value: '5'}
      ],
      table: {
        columns: [
          {name: '__component:shipment-status', title: this.$t('status'), titleClass: 'fix-width', dataClass: 'vertical-centered has-text-centered'},
          {name: 'tntNumber', title: this.$t('tnt'), sortField: 'tntNumber'},
          {name: 'senderCompany', title: this.$t('send_comp'), sortField: 'senderCompany'},
          {name: 'receiverCompany', title: this.$t('rcv_comp'), sortField: 'receiverCompany'},
          {name: 'dateSent', title: this.$t('date_sent'), sortField: 'dateSent', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
          {name: 'dateReceived', title: this.$t('date_received'), sortField: 'dateReceived', callback: 'formatDate|DD.MM.YYYY, HH:mm'},
          {name: '__slot:transit', title: this.$t('transit')}
        ],
        sortOrder: [{
          field: 'updatedAt',
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
    },
    updateStatus (value) {
      this.status = value
      Vue.nextTick(() => {
        this.$refs.vuetable.reload()
      })
    }
  },
  computed: {
    moreParams () {
      return {
        status: this.status
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
