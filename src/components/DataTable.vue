<template>
  <v-client-table :data="data" :columns="columns" :options="finalOptions"></v-client-table>
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
  @import '../variables';
  @import '~bulma/sass/utilities/controls';
  @import '~bulma/sass/utilities/mixins';
  //@import '~bulma/sass/grid/columns';
  @import '~bulma/sass/elements/button';
  //@import '~bulma/sass/elements/form';

  .VueTables{
    /*& > .row {
      @extend .columns;

      & > .col-md-6{
        @extend .columns;
        @extend .is-6;
      }
    }
    & .form-group{
      @extend .control;
      //@extend .is-horizontal;

      & label{
        @extend .label;
      }
      & input{
        @extend .input;
      }
    }*/

    & .pagination li {
      & > a {
        @extend .button
      }
      &.active > a {
        @extend .is-primary
      }
    }
  }
  /*.VuePagination{
    color: red;
  }*/

  /*.modum-data-table {

    & li {
      list-style: none;
    }
  }*/
</style>