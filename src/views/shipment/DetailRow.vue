<template>
  <div v-if="chartData" class="columns">
    <div class="column is-three-quarters">
      <div class="box" v-if="chartData.length">
        <h1 class="title is-5">{{$t('temperature_measurements')}}</h1>
        <hr>
        <plotly
          v-if="chartData.length"
          :data="chartData"
          :min="rowData.tempCat.minTemp"
          :max="rowData.tempCat.maxTemp"
          :filename="rowData.tnt"
          :layout="layout"
        ></plotly>
      </div>
      <div class="box" v-else>
        <h1 class="title is-5">{{$t('shipment_not_received')}}</h1>
      </div>
    </div>

    <div class="column">
      <div class="box">
        <h1 class="title is-5">Infos</h1>
        <hr>

        <div class="inline field">
          <label><b>{{$t('tnt')}}</b>: </label>
          <span>{{rowData.tnt}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('sensor')}}</b>: </label>
          <span>{{rowData.sensorID}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('send_comp')}}</b>: </label>
          <span>{{senderCompany}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('send_user')}}</b>: </label>
          <span>{{senderUser}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('rcv_comp')}}</b>: </label>
          <span>{{receiverCompany}}</span>
        </div>
        <div class="inline field">
          <label><b>{{$t('rcv_user')}}</b>: </label>
          <span>{{receiverUser}}</span>
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
          <span>{{rowData.tempCat.name}}</span>
        </div>
        <div v-if="link" class="inline field" :style="{marginTop: '20px'}">
          <router-link class="button is-fullwidth is-primary" :to="{name: 'Detail', params: {id: rowData.id}}">Detail</router-link>
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
    this.chartData = this.createChartData(this.rowData.measurements)
  },
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    },
    link: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      chartData: null
    }
  },
  methods: {
    decodeMeasurements (data) {
      let binary = window.atob(data)
      let len = binary.length
      let bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      return Array.from(bytes.map(val => {
        let newVal = val < 0 ? val += 0x100 : val
        return newVal * (60.0 / 0xff) - 10
      }))
    },
    createChartData (data) {
      let decode = this.decodeMeasurements(data)
      let start = new Date(this.rowData.measurementStart)

      return decode
      ? [{
        x: decode.map((item, idx) => new Date(start.getTime() + idx * (this.rowData.measurementInterval * 60 * 1000))), // data.map(item => moment(item.timestamp).format('DD.MM.YYYY, HH:mm')),
        y: decode
      }]
      : []
    }
  },
  filters: {
    formatDate (value) {
      return moment(value).format('DD.MM.YYYY, HH:mm')
    }
  },
  computed: {
    senderUser () {
      try {
        return `${this.rowData.sender.firstname} ${this.rowData.sender.lastname}`
      } catch (e) {
        return ''
      }
    },
    senderCompany () {
      try {
        return this.rowData.sender.company.name
      } catch (e) {
        return ''
      }
    },
    receiverUser () {
      try {
        return `${this.rowData.receiver.firstname} ${this.rowData.receiver.lastname}`
      } catch (e) {
        return ''
      }
    },
    receiverCompany () {
      try {
        return this.rowData.receiver.company.name
      } catch (e) {
        return ''
      }
    },
    tempCat () {
      try {
        return this.rowData.tempCat.name
      } catch (e) {
        return ''
      }
    },
    min () {
      return this.chartData.length ? Math.min(...this.chartData[0].y) : 0
    },
    max () {
      return this.chartData.length ? Math.max(...this.chartData[0].y) : 0
    },
    range () {
      let offset = 3
      return [
        this.min - offset < this.rowData.minTemp ? this.min - offset : this.rowData.minTemp - offset,
        this.max + offset > this.rowData.maxTemp ? this.max + offset : this.rowData.maxTemp + offset
      ]
    },
    layout () {
      return {
        margin: {
          l: 50,
          r: 50,
          b: 50,
          t: 50,
          pad: 4
        },
        yaxis: {
          title: '°C',
          range: this.range
        }
      }
    }
  }
}
</script>
