<template>
  <span v-if="statusCode < 0">{{this.$t('status_transit')}}</span>
  <i v-else-if="statusCode === 0" class="fa fa-check ok"></i>
  <i v-else class="fa fa-times bad"></i>
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
  @import "../../variables";

  .ok {
    color: $success
  }

  .bad {
    color: $danger
  }
</style>
