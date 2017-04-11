import Vue from 'vue'
import Vuetable from 'vuetable-2/src/components/Vuetable.vue'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo'
import FilterBar from './FilterBar.vue'
import Pagination from './Pagination.vue'
import FormSelect from '../FormSelect.vue'
import moment from 'moment'

export default {
  components: {
    Vuetable,
    VuetablePaginationInfo,
    FilterBar,
    Pagination,
    FormSelect
  },
  render (h) {
    return h('div', [
      h('nav', {class: 'level is-marginless'}, [
        h('div', {class: 'level-left'}, [
          h('div', {class: 'level-item'}, [
            h('filter-bar')
          ])
        ]),
        h('div', {class: 'level-right'}, [
          h('div', {class: 'level-item'}, [
            h('vuetable-pagination-info', {ref: 'paginationInfo',
              props: {
                infoClass: ''
              }})
          ]),
          h('div', {class: 'level-item'}, [
            h('form-select', {
              props: {
                options: [
                  {label: '10', value: 10},
                  {label: '25', value: 25},
                  {label: '50', value: 50},
                  {label: '100', value: 100}
                ],
                value: this.numberOfItems
              },
              on: {
                input: value => {
                  this.numberOfItems = JSON.parse(value)
                  Vue.nextTick(() => this.reload())
                }
              }
            })
          ])
        ])
      ]),
      h('vuetable', {ref: 'vuetable',
        scopedSlots: this.$scopedSlots,
        props: {
          'api-url': this.url,
          css: this.css,
          'per-page': this.numberOfItems,
          fields: this.fields,
          sortOrder: this.sortOrder,
          paginationPath: this.paginationPath,
          'data-path': this.dataPath,
          'detail-row-component': this.rowComponent
        },
        on: {
          'vuetable:cell-clicked': this.onCellClicked,
          'vuetable:pagination-data': this.onPaginationData
        }
      }),
      h('pagination', {ref: 'pagination', on: {'vuetable-pagination:change-page': this.onChangePage}})
    ])
  },
  data () {
    return {
      numberOfItems: 10
    }
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
      type: Array
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
    },
    'row-component': {
      type: String
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
    reload () {
      this.$refs.vuetable.reload()
    },
    onCellClicked (data, field, event) {
      if (this.rowComponent) {
        this.$refs.vuetable.toggleDetailRow(data.id)
      }
    },
    formatDate (value, fmt = 'DD.MM.YYYY, HH:mm') {
      let parsed = moment(value).format(fmt)
      return (value === null || parsed === '01.01.0001, 01:00')
        ? 'n/a'
        : parsed
    }
  }
}
