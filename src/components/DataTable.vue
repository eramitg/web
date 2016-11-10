<template>
  <v-client-table :data="data" :columns="columns" :options="finalOptions" class="modum-data-table"></v-client-table>
</template>

<script>

export default {
  props: {
    data: {
      type: Array,
      required: true,
      default: () => ({})
    },
    columns: {
      type: Array,
      required: true,
      default: () => ([])
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    finalOptions(){
      return {
        skin: '',
        sortIcon: {
          base: 'fa',
          up: 'fa-sort-asc',
          down: 'fa-sort-desc',
        },
        ...this.options
      }
    }
  }
}
</script>

<style lang="scss">

  .modum-data-table {
    & li {
      list-style: none;
    }
  }
</style>