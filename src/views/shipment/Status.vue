<template>
  <img class="small" v-if="statusCode < 0" src="../../assets/icons/shipment_underway.svg" :alt="$t('status_transit')">
  <img class="small" v-else-if="statusCode === 0" src="../../assets/icons/inside_specifications.svg" :alt="$t('status_ok')">
  <img class="small" v-else src="../../assets/icons/outside_specifications.svg" :alt="$t('status_bad')">
</template>

<script>
export default {
  props: {
    rowData: {
      type: Object,
      required: true
    },
    rowIndex: {
      type: Number
    }
  },
  computed: {
    statusCode () {
      return !this.rowData.isFailed && !this.rowData.isSuccess ? -1 : this.rowData.nrFailures
    }
  }
}
</script>

<style lang="scss" scoped>
  .small {
    height: 50%;
    vertical-align: middle;
  }
</style>
