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
      :detail-row-component="row"
      @vuetable:cell-clicked="onCellClicked"
      @vuetable:pagination-data="onPaginationData"
    >
    <slot></slot>
  </vuetable>
    <bulma-pagination ref="pagination"
      @vuetable-pagination:change-page="onChangePage"
    ></bulma-pagination>
  </div>
</template>

<script>
  import Vuetable from 'vuetable-2/src/components/Vuetable.vue';
  import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo';
  import FilterBar from './FilterBar.vue';
  import BulmaPagination from './BulmaPagination.vue';
  import mixin from './mixin';
  export default{
    mixins: [mixin],
    components: {
      Vuetable,
      BulmaPagination,
      VuetablePaginationInfo,
      FilterBar
    }
  }
</script>
