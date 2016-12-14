<template>
  <div id="content">
    <vuetable ref="vuetable" :api-url="url" :css="css" :fields="fields" :paginationPath="paginationPath" :data-path="dataPath" :sortOrder="sortOrder"
              @vuetable:pagination-data="onPaginationData"
    />
    <vuetable-pagination :css="paginationCss" :icons="paginationIcons" ref="pagination" @vuetable-pagination:change-page="onChangePage"></vuetable-pagination>
  </div>
</template>

<script>
  import Vuetable from 'vuetable-2/src/components/Vuetable.vue';
  import VuetablePagination from './TablePagination.vue';
  export default{
    components: {
      Vuetable,
      VuetablePagination
    },
    props: {
      url: {
        type: String,
        default: '',
        required: true
      },
      fields: {
        type: Array,
        required: true
      },
      sortOrder: {
        type: Array,
        required: true
      },
      css: {
        type: Object,
        default: () => ({
          tableClass: 'table is-striped',
          ascendingIcon: 'fa fa-chevron-up',
          descendingIcon: 'fa fa-chevron-down',
          loadingClass: 'fa fa-spinner fa-pulse fa-3x fa-fw'
        })
      },
      paginationPath: {
        type: String,
        default: ''
      },
      dataPath: {
        type: String,
        default: 'data'
      },
      paginationCss: {
        type: Object,
        default: () => ({
          wrapperClass: 'pagination',
          pageClass: 'button',
          linkClass: 'button',
          activeClass: 'is-primary'
        })
      },
      paginationIcons: {
        type: Object,
        default: () => ({
          first: 'fa fa-angle-double-left',
          prev: 'fa fa-angle-left',
          next: 'fa fa-angle-right',
          last: 'fa fa-angle-double-right'
        })
      }
    },
    methods: {
      onPaginationData (tablePagination) {
        //this.$refs.paginationInfo.setPaginationData(tablePagination)
        this.$refs.pagination.setPaginationData(tablePagination)
      },
      onChangePage (page) {
        this.$refs.vuetable.changePage(page)
      },
    }
  }
</script>
