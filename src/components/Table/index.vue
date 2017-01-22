<template>
  <div id="content">
    <nav class="level is-marginless">
      <div class="level-left">
        <div class="level-item">
          <filter-bar></filter-bar>
        </div>
      </div>
      <div class="level-right">
        <vuetable-pagination-info ref="paginationInfo"
        ></vuetable-pagination-info>
      </div>
    </nav>
    <vuetable ref="vuetable"
      :api-url="url"
      :css="css"
      :fields="fields"
      :paginationPath="paginationPath"
      :data-path="dataPath"
      :sortOrder="sortOrder"
      @vuetable:pagination-data="onPaginationData"
    />
    <bulma-pagination ref="pagination"
      @vuetable-pagination:change-page="onChangePage"
    ></bulma-pagination>
  </div>
</template>

<script>
  import Vuetable from 'vuetable-2/src/components/Vuetable.vue';
  import VuetablePagination from './TablePagination.vue';
  import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo';
  import FilterBar from './FilterBar.vue';
  import BulmaPagination from './BulmaPagination.vue';
  export default{
    components: {
      Vuetable,
      BulmaPagination,
      VuetablePaginationInfo,
      FilterBar
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
          tableClass: 'table is-bordered is-striped',
          ascendingIcon: 'fa fa-chevron-up',
          descendingIcon: 'fa fa-chevron-down',
          sortHandleIcon: 'fa fa-bars',
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
        this.$refs.paginationInfo.setPaginationData(tablePagination)
        this.$refs.pagination.setPaginationData(tablePagination)
      },
      onChangePage (page) {
        this.$refs.vuetable.changePage(page)
      },
      reload() {
        this.$refs.vuetable.reload()
      }
    }
  }
</script>
