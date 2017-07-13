<template>
  <div class="columns">
    <div class="column is-three-quarters">
      <div v-if="decodedMeasurements.length" class="box">
        <div class="tabs is-boxed is-medium">
          <ul>
            <li :class="{'is-active': page === 0}">
              <a @click="page = 0"><span class="icon"><i class="fa fa-line-chart"></i></span><span>{{$t('temperature_measurements')}}</span></a>
            </li>
            <li :class="{'is-active': page === 1}">
              <a @click="page = 1"><span class="icon"><i class="fa fa-bar-chart"></i></span><span>Histogram</span></a>
            </li>
            <li :class="{'is-active': page === 2}">
              <a @click="page = 2"><span class="icon"><i class="fa fa-table"></i></span><span>Data Table</span></a>
            </li>
          </ul>
        </div>
        <plotly
          v-if="page === 0 && timeseriesChart.length"
          key="timeseries"
          :data="timeseriesChart"
          :min="rowData.tempCat.minTemp"
          :max="rowData.tempCat.maxTemp"
          :filename="rowData.tnt"
          :layout="timeLayout"
        ></plotly>
        <plotly
          v-if="page === 1 && histogramChart.length"
          key="histogram"
          :data="histogramChart"
          :filename="rowData.tnt"
          :layout="histogramLayout"
        ></plotly>
        <div v-if="page === 2" class="data-table">
          <table v-if="timeseriesChart.length" key="datatable" class="table is-fullwidth data-table">
            <thead>
              <th><abbr title="Number">Nr</abbr></th>
              <th>Time</th>
              <th>Temperature</th>
            </thead>
            <tbody>
              <tr v-for="temp, idx in dataTable">
                <td>{{idx + 1}}</td>
                <td>{{temp.time | formatDate}}</td>
                <td>{{temp.temperature}}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
        <div v-if="link" class="inline field" :style="{marginTop: '1rem'}">
          <router-link class="button is-fullwidth is-primary" :to="{name: 'Detail', params: {id: rowData.id}}">Detail</router-link>
        </div>
      </div>
      <div class="box">
        <h1 class="title is-5">Mean Kinetic Temperature</h1>
        <hr>

        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field is-grouped">
              <p class="control is-expanded">
                <form-input v-model.number="defaultActivationEnergy" :horizontal="true" type="number" label="Activation Energy" v-validate="'required'" name="activation_energy"/>
              </p>
            </div>
          </div>
        </div>
        <div class="block" :style="{marginTop: '1rem'}">
          <button type="button" class="button is-primary" @click="calculateMKT">Calculate</button>
          <button type="button" class="button is-info" @click="resetMKT">Reset</button>
        </div>
        <div class="inline field">
          <label><b>MKT</b>: </label>
          <span v-if="mkt != 0" v-model="mkt">{{this.mkt}} °C</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Chart from '../../components/Chart.vue'
import Plotly from '../../components/Plotly.vue'
import Switches from 'vue-switches'
import FormInput from '../../components/FormInput.vue'
export default {
  components: {
    Chart,
    Plotly,
    Switches,
    FormInput
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({}),
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
  filters: {
    formatDate (value) {
      return moment(value).format('DD.MM.YYYY, HH:mm')
    }
  },
  data () {
    return {
      page: 0,
      defaultActivationEnergy: 83.14472,
      mkt: 0
    }
  },
  computed: {
    decodedMeasurements () {
      try {
        let {measurements} = this.rowData
        let binary = window.atob(measurements)
        let len = binary.length
        let bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        return Array.from(bytes.map(val => {
          let newVal = val < 0 ? val += 0x100 : val
          return newVal * (60.0 / 0xff) - 10
        }))
      } catch (e) {
        return []
      }
    },
    timeseriesChart () {
      try {
        let {measurementStart, measurementInterval} = this.rowData
        let start = new Date(measurementStart)

        return [{
          x: this.decodedMeasurements.map((item, idx) => new Date(start.getTime() + idx * (measurementInterval * 60 * 1000))),
          y: this.decodedMeasurements
        }]
      } catch (e) {
        return []
      }
    },
    histogramChart () {
      try {
        return [{
          x: this.decodedMeasurements,
          type: 'histogram'
        }]
      } catch (e) {
        return []
      }
    },
    dataTable () {
      try {
        let {measurementStart, measurementInterval} = this.rowData
        let start = new Date(measurementStart)

        return this.decodedMeasurements.map((item, idx) => {
          return {
            time: new Date(start.getTime() + idx * (measurementInterval * 60 * 1000)),
            temperature: item
          }
        })
      } catch (e) {
        return []
      }
    },
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
      return this.decodedMeasurements.length ? Math.min(...this.decodedMeasurements) : 0
    },
    max () {
      return this.decodedMeasurements.length ? Math.max(...this.decodedMeasurements) : 0
    },
    range () {
      let offset = 3
      return [
        this.min - offset < this.rowData.minTemp ? this.min - offset : this.rowData.minTemp - offset,
        this.max + offset > this.rowData.maxTemp ? this.max + offset : this.rowData.maxTemp + offset
      ]
    },
    timeLayout () {
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
    },
    histogramLayout () {
      return {
        margin: {
          l: 50,
          r: 50,
          b: 50,
          t: 50,
          pad: 4
        },
        bargap: 0.15
      }
    }
  },
  methods: {
    calculateMKT () {
      var gasConstant = 8.314472
      var numOfMeasurements = this.decodedMeasurements.length

      var tempsInKelvin = this.decodedMeasurements.map(item => item + 273.15)
      var defaultActivationEnergy = this.defaultActivationEnergy
      var denominators = tempsInKelvin.map(item => Math.exp(-defaultActivationEnergy / (gasConstant * item)))
      var sumOfDenominators = denominators.reduce((a, b) => a + b)
      var logResult = -Math.log(sumOfDenominators / numOfMeasurements)

      var mktInKelvin = (this.defaultActivationEnergy / gasConstant) / logResult
      this.mkt = mktInKelvin - 273.15
    },
    resetMKT () {
      this.defaultActivationEnergy = 83.14472
      this.mkt = 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .data-table {
    max-height: 400px;
    overflow: scroll;
  }
</style>
