<template>
  <div v-if="tablePagination && tablePagination.last_page > 1" :class="css.wrapperClass">
    <ul v-if="notEnoughPages">
      <li>
        <a @click="loadPage(1)"
           :class="[{'btn-nav': true}, css.linkClass, isOnFirstPage ? css.disabledClass : '']">
          <span v-if="icons.first != ''" class="icon"><i :class="[icons.first]"></i></span>
          <span v-else>&laquo;</span>
        </a>
      </li>
      <li>
        <a @click="loadPage('prev')"
           :class="[{'btn-nav': true}, css.linkClass, isOnFirstPage ? css.disabledClass : '']">
          <span v-if="icons.next != ''" class="icon"><i :class="[icons.prev]"></i></span>
          <span v-else>&nbsp;&lsaquo;</span>
        </a>
      </li>

      <li v-for="n in totalPage">
        <a @click="loadPage(n)"
           :class="[css.pageClass, isCurrentPage(n) ? css.activeClass : '']"
           v-html="n">
        </a>
      </li>

      <li>
        <a @click="loadPage('next')"
           :class="[{'btn-nav': true}, css.linkClass, isOnLastPage ? css.disabledClass : '']">
          <span v-if="icons.next != ''" class="icon"><i :class="[icons.next]"></i></span>
          <span v-else>&rsaquo;&nbsp;</span>
        </a>
      </li>
      <li>
        <a @click="loadPage(totalPage)"
           :class="[{'btn-nav': true}, css.linkClass, isOnLastPage ? css.disabledClass : '']">
          <span v-if="icons.last != ''" class="icon"><i v-if="icons.last != ''" :class="[icons.last]"></i></span>
          <span v-else>&raquo;</span>
        </a>
      </li>
    </ul>
    <template v-else>
      <template v-for="n in windowSize">
        <a @click="loadPage(windowStart+n-1)"
           :class="[css.pageClass, isCurrentPage(windowStart+n-1) ? css.activeClass : '']"
           v-html="windowStart+n-1">
        </a>
      </template>
    </template>
  </div>
</template>

<script>
import PaginationMixin from 'vuetable-2/src/components/VuetablePaginationMixin.vue'
export default {
  mixins: [PaginationMixin],
}
</script>