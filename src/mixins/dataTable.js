import moment from 'moment';

export default {
  data() {
    return {
      bulmaTableCss: {
        tableClass: 'table is-bordered is-stripe',
        ascendingIcon: 'fa fa-chevron-up',
        descendingIcon: 'fa fa-chevron-down',
        sortHandleIcon: 'fa fa-bars',
        loadingClass: 'fa fa-spinner fa-pulse fa-3x fa-fw'
      },
      dataPath: 'data',
      paginationPath: ''
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
    },
    onCellClicked (data, field, event) {
      this.$refs.vuetable.toggleDetailRow(data.id)
    },
    formatDate (value, fmt = 'DD.MM.YYYY, HH:mm') {
      return (value == null)
        ? ''
        : moment(value).format(fmt)
    },
  }
}
