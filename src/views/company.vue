<template>
  <div class="tile is-parent is-12">
    <article class="tile is-child box">
      <h1 class="title">
        Users
        <button class="button" @click="showModal = true">
          <span class="fa fa-user-plus"></span>
        </button>
      </h1>
      <hr>
        <data-table url="/api/users" :fields="columns" :sortOrder="sortOrder" />
    </article>
  </div>
</template>

<script>
  import DataTable from '../components/Table'
  export default {
    components: {
      DataTable
    },
    data(){
      return {
        columns: [{name: 'userName', sortField: 'userName'}, 'userRole', 'companyName'],
        css: {
          tableClass: 'table is-striped',
          ascendingIcon: 'fa fa-chevron-up',
          descendingIcon: 'fa fa-chevron-down',
          loadingClass: 'fa fa-spinner fa-pulse fa-3x fa-fw'
        },
        sortOrder: [{
          field: 'userName',
          direction: 'asc'
        }]
      }
    }
  }
</script>