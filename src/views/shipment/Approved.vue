<template>
  <i v-if="rowData.approvedID > 0" class="fa fa-check watched"></i>
</template>

<script>
export default {
  props: {
    rowData: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .watched {
    color: $success
  }
</style>
