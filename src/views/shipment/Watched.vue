<template>
  <i v-if="watched" class="fa fa-eye watched"></i>
  <i v-else class="fa fa-eye-slash not-watched" @click="toggleWatched"></i>
</template>

<script>
export default {
  props: {
    rowData: {
      type: Object,
      required: true
    }
  },
  computed: {
    watched () {
      try {
        let {watchedID} = this.rowData
        return watchedID > 0
      } catch (e) {
        return false
      }
    }
  },
  methods: {
    async toggleWatched () {
      let {id} = this.rowData
      try {
        let {data} = await this.$http.post(`shipments/${id}/watched`)
        this.rowData.watchedID = data.watchedID
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../variables';

  .not-watched {
    color: $danger
  }

  .watched {
    color: $success
  }
</style>
