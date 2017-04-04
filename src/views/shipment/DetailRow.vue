<template>
  <div v-if="chart.data" class="columns">
    <div class="column is-three-quarters">
      <div class="box">
        <h1 class="title is-5">{{$t('temperature_measurements')}}</h1>
        <hr>
        <plotly
          v-if="chart.data"
          :data="chart.data"
          :min="rowData.minTemp"
          :max="rowData.maxTemp"
        ></plotly>
      </div>
    </div>

    <div class="column">
      <div class="box">
        <h1 class="title is-5">Infos</h1>
        <hr>

        <div class="inline field">
          <label><b>{{$t('tnt')}}</b>: </label>
          <span>{{rowData.tntNumber}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('sensor')}}</b>: </label>
          <span>{{rowData.sensorID}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('send_comp')}}</b>: </label>
          <span>{{rowData.senderCompany}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('send_user')}}</b>: </label>
          <span>{{rowData.sender}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('rcv_comp')}}</b>: </label>
          <span>{{rowData.receiverCompany}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('rcv_user')}}</b>: </label>
          <span>{{rowData.receiver}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('date_sent')}}</b>: </label>
          <span>{{rowData.dateSent | formatDate}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('date_received')}}</b>: </label>
          <span>{{rowData.dateReceived | formatDate}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('cat')}}</b>: </label>
          <span>{{rowData.tempCategory}}</span>
        </div>
      </div>
    </div>
    </div>
  </div>
  <div v-else class="has-text-centered">
    <i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script>
import moment from 'moment'
import Chart from '../../components/Chart.vue'
import Plotly from '../../components/Plotly.vue'
export default {
  components: {
    Chart,
    Plotly
  },
  async created () {
    let {data} = await this.$http.get(`v2/parcels/details/${this.rowData.id}`)
    this.chart.data = this.createChartData(data)
  },
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  },
  data () {
    return {
      chart: {
        data: null
      }
    }
  },
  methods: {
    createChartData (data) {
      return data
      ? [{
        x: data.map(item => new Date(item.timestamp)), // data.map(item => moment(item.timestamp).format('DD.MM.YYYY, HH:mm')),
        y: data.map(item => item.temperature)
      }]
      : []
    }
  },
  filters: {
    formatDate (value) {
      return moment(value).format('DD.MM.YYYY, HH:mm')
    }
  }
}
</script>
