<template>
  <div class="columns" @click="onClick">
    <div class="column is-three-quarters">
      <div class="box">
        <h1 class="title is-5">{{$t('temperature_measurements')}}</h1>
        <hr>
        <chart
          v-if="chart.data"
          :type="'line'"
          :data="chart.data"
          :options="chart.options"
        />
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
          <label><b>{{$t('send_user')}}</b>: </label>
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
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Chart from '../../components/Chart.vue'
export default {
  components: {
    Chart
  },
  async mounted () {
    let {data} = await axios.get(`/api/v2/parcels/details/${this.rowData.id}`)
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
        data: null,
        options: {
          responsive: true,
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                tooltipFormat: 'DD.MM.YYYY, HH:mm',
                displayFormats: {
                  minute: 'HH:mm:ss',
                  hour: 'HH:mm:ss',
                  day: 'DD.MM.YYYY, HH:mm'
                }
              }
            }],
            yAxes: [
              {
                ticks: {
                  max: 40,
                  min: 0,
                  fixedStepSize: 3
                },
                scaleLabel: {
                  display: true,
                  labelString: '°C'
                }
              }
            ]
          },
          legend: {
            display: false
          },
          horizontalLine: [
            { y: 25, style: '#FFA100' },
            { y: 15, style: '#25A9E1' }
          ],
          pan: {
            enabled: false,
            mode: 'xy'
          },
          zoom: {
            enabled: false,
            mode: 'xy'
          }
        }
      }
    }
  },
  methods: {
    onClick (event) {
      console.log('my-detail-row: on-click', event.target)
    },
    createChartData (data) {
      return data
      ? {
        labels: data.map(item => item.timestamp),
        datasets: [{
          data: data.map(item => item.temperature),
          label: 'Temperature',
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 2,
          pointHitRadius: 2
        }]
      }
      : {}
    }
  },
  filters: {
    formatDate (value) {
      return moment(value).format('DD.MM.YYYY, HH:mm')
    }
  }
}
</script>
