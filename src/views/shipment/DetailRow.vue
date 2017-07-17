<template>
  <div class="tile is-ancestor">
    <div class="tile is-parent is-8">
      <div class="tile is-child box" v-if="decodedMeasurements.length">
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

    <div class="tile is-vertical is-parent is-4">
      <div class="tile is-child box">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <h1 class="title is-5">Infos</h1>
            </div>
          </div>
          <div class="level-right">
            <p class="level-item">
              <a class="icon" @click="exportCSV"><i class="fa fa-file-o"></i></a>
            </p>
            <div class="level-item">
              <a class="icon" @click="exportXLSX"><i class="fa fa-file-excel-o"></i></a>
            </div>
            <div class="level-item">
              <a class="icon" href="/api/static/draft9.pdf" target="_blank">
                <i class="fa fa-file-pdf-o"></i>
              </a>
            </div>
          </div>
        </div>
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
      </div>

      <div class="tile is-child box" v-if="rowData.calculation">
        <h1 class="title is-5">Calculations</h1>
        <hr>
        <div class="inline field">
          <label><b>Minimum</b>: </label>
          <span>{{min}}</span>
        </div>
        <div class="inline field">
          <label><b>Maximum</b>: </label>
          <span>{{max}}</span>
        </div>
        <div class="inline field">
          <label><b>Average</b>: </label>
          <span>{{avg}}</span>
        </div>
        <div class="inline field">
          <label><b>Kelvin Minutes</b>: </label>
          <span>{{kelvinMinutes}}</span>
        </div>
        <div class="inline field">
          <label><b>Mean Kinetic Temperature</b>: </label>
          <span v-if="mkt !== 'NaN'" v-model="mkt">{{mkt}} °C</span>
        </div>
        <form-input v-if="!link" type="number" label="Activation Energy:" v-model.number="defaultActivationEnergy">
          <a @click="resetActivationEnergy" class="button is-primary">Reset</a>
        </form-input>
      </div>

      <div class="tile is-child">
        <div class="columns">
          <div class="column">
            <button v-if="rowData.approvedID > 0" type="button" name="button" class="button is-success is-fullwidth" disabled><i class="fa fa-check"></i>Approved</button>
            <button v-else type="button" name="button" class="button is-primary is-fullwidth" @click="setApproved">Approve</button>
          </div>
          <div class="column" v-if="link" >
            <router-link class="button is-fullwidth is-primary" :to="{name: 'Detail', params: {id: rowData.id}}">Go to Detail</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import papaparse from 'papaparse'
import XLSX from 'xlsx'
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
      defaultActivationEnergy: 83.14472
    }
  },
  methods: {
    resetActivationEnergy () {
      this.defaultActivationEnergy = 83.14472
    },
    exportCSV () {
      try {
        let {tnt} = this.rowData
        let data = papaparse.unparse(this.dataTable)
        let csvData = new Blob([data], {type: 'text/csv;charset=utf-8;'})
        let csvURL = window.URL.createObjectURL(csvData)
        let tempLink = document.createElement('a')
        tempLink.href = csvURL
        tempLink.setAttribute('download', `${tnt}.csv`)
        tempLink.click()
      } catch (e) {
        this.$store.dispatch('notify', {text: 'Unfortunately there was an error generating the CSV', type: 'danger'})
      }
    },
    exportXLSX () {
      try {
        let {tnt} = this.rowData
        let wb = {
          SheetNames: [],
          Sheets: {},
          Props: {
            Title: tnt,
            Author: 'Modum.io'
          }
        }
        let ws = XLSX.utils.json_to_sheet(this.dataTable)
        XLSX.utils.book_append_sheet(wb, ws, 'Data')
        let data = XLSX.write(wb, {bookType: 'xlsx', type: 'buffer'})
        var xlsxData = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;'})
        var csvURL = window.URL.createObjectURL(xlsxData)
        var tempLink = document.createElement('a')
        tempLink.href = csvURL
        tempLink.setAttribute('download', `${tnt}.xlsx`)
        tempLink.click()
      } catch (e) {
        console.log(e)
        this.$store.dispatch('notify', {text: 'Unfortunately there was an error generating the Excel', type: 'danger'})
      }
    },
    async setApproved () {
      let {id} = this.rowData
      try {
        let {data} = await this.$http.post(`shipments/${id}/approved`)
        this.rowData.approvedID = data.approvedID
      } catch (e) {
        console.log(e)
      }
    }
  },
  computed: {
    mkt () {
      try {
        let gasConstant = 8.314472
        let numOfMeasurements = this.decodedMeasurements.length

        let tempsInKelvin = this.decodedMeasurements.map(item => item + 273.15)
        let defaultActivationEnergy = this.defaultActivationEnergy
        let denominators = tempsInKelvin.map(item => Math.exp(-defaultActivationEnergy / (gasConstant * item)))
        let sumOfDenominators = denominators.reduce((a, b) => a + b)
        let logResult = -Math.log(sumOfDenominators / numOfMeasurements)

        let mktInKelvin = (this.defaultActivationEnergy / gasConstant) / logResult
        return mktInKelvin - 273.15
      } catch (e) {
        return 0
      }
    },
    decodedMeasurements () {
      try {
        let {measurements} = this.rowData
        let binary = window.atob(measurements)
        let len = binary.length
        let bytes = new Float32Array(len)
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
      try {
        return this.rowData.calculation.min
      } catch (e) {
        return 0
      }
      // return this.decodedMeasurements.length ? Math.min(...this.decodedMeasurements) : 0
    },
    max () {
      try {
        return this.rowData.calculation.max
      } catch (e) {
        return 0
      }
      // return this.decodedMeasurements.length ? Math.max(...this.decodedMeasurements) : 0
    },
    avg () {
      try {
        return this.rowData.calculation.average
      } catch (e) {
        return 0
      }
    },
    kelvinMinutes () {
      try {
        return this.rowData.calculation.kelvinMinutes
      } catch (e) {
        return 0
      }
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
  }
}
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .data-table {
    max-height: 400px;
    overflow: scroll;
  }

  .not-watched {
    color: $danger
  }

  .watched {
    color: $success
  }
</style>
