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
        <template slot="temperature" scope="props">
          {{visualizeTemperature(props.rowData)}}
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
          {name: '__slot:temperature', title: this.$t('temperature'), dataClass: 'vertical-centered has-text-centered'},
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
      if (received === '0001-01-01T00:34:08+00:34') {
        return 'n/a'
      }

      let diff = moment.duration(moment(received).diff(moment(sent)))

      return diff.humanize()
    },
    visualizeTemperature ({calculation, tempCat}) {
      try {
        let numberOfChars = 10
        let spaceChar = '.'
        let minChar = '-'
        let maxChar = '+'

        let {minTemp, maxTemp} = tempCat
        let {min, max} = calculation
        let diff = ((maxTemp >= max ? maxTemp : max) - (minTemp <= min ? minTemp : min)) / numberOfChars
        let before = ''
        let middle = ''
        let after = ''

        // handle before
        if (min < minTemp && max < minTemp) {
          let betweenMinMax = (max - min) / diff
          let afterMax = (minTemp - max) / diff
          before = minChar + spaceChar.repeat(betweenMinMax) + maxChar + spaceChar.repeat(afterMax)
        } else if (min < minTemp) {
          let afterMin = (minTemp - min) / diff
          before = minChar + spaceChar.repeat(afterMin)
        }

        // handle middle
        if ((min > minTemp && min < maxTemp) && (max > minTemp && max < maxTemp)) {
          let beforeMin = (min - minTemp) / diff
          let betweenMinMax = (max - min) / diff
          let afterMax = (maxTemp - max) / diff
          middle = spaceChar.repeat(beforeMin) + minChar + spaceChar.repeat(betweenMinMax) + maxChar + spaceChar.repeat(afterMax)
        } else if (min > minTemp && min < maxTemp) {
          let beforeMin = (min - minTemp) / diff
          let afterMin = (maxTemp - min) / diff
          middle = spaceChar.repeat(beforeMin) + minChar + spaceChar.repeat(afterMin)
        } else if (max > minTemp && max < maxTemp) {
          let beforeMax = (max - minTemp) / diff
          let afterMax = (maxTemp - max) / diff
          middle = spaceChar.repeat(beforeMax) + maxChar + spaceChar.repeat(afterMax)
        }

        // handle after
        if (min > maxTemp && max > maxTemp) {
          let beforeMin = (min - maxTemp) / diff
          let betweenMinMax = (max - min) / diff
          after = spaceChar.repeat(beforeMin) + minChar + spaceChar.repeat(betweenMinMax) + maxChar
        } else if (max > maxTemp) {
          let beforeMax = (max - maxTemp) / diff
          after = spaceChar.repeat(beforeMax) + maxChar
        }

        return `${before}${minTemp}|${middle}|${maxTemp}${after}`
      } catch (e) {
        console.log(e)
        return 'Error =)'
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
