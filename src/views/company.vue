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
      <div id="content">
        <vuetable api-url="/api/users" :css="css" :fields="columns"
                  paginationPath=""
                  data-path="data"
                  :sortOrder="sortOrder"
        />
        <vuetable-pagination></vuetable-pagination>
      </div>
    </article>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        columns: [{name: 'userName', sortField: 'userName'}, 'userRole', 'companyName'],
        paginationComponent: 'vuetable-pagination',
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