<template>
  <detail-row v-if="shipment" :rowData="shipment" :link="false"></detail-row>
  <div v-else class="has-text-centered">
    <i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script>
import Vue from 'vue'
import DetailRow from './shipment/DetailRow.vue'
export default {
  components: {
    DetailRow
  },
  async beforeRouteEnter (to, from, next) {
    try {
      let {data} = await Vue.http.get(`shipments/${to.params.id}?nested=1`)
      next(vm => {
        vm.$data.shipment = data
      })
    } catch (e) {
      next()
    }
  },
  data () {
    return {
      shipment: null
    }
  }
}
</script>
