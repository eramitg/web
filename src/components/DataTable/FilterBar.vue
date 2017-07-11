<template>
  <div v-if="query.length > 0" class="filter-bar control is-grouped">
    <div class="control">
      <div class="select">
        <select v-model="filter">
          <option :value="null" disabled>Choose your filter</option>
          <option v-for="option in query" :value="option">{{option.name}}</option>
        </select>
      </div>
    </div>

    <template v-if="filter && filter.options">
      <div class="control is-expanded has-addons">
        <span class="select">
          <select v-model="value">
            <option disabled>Please select one</option>
            <option v-for="option in filter.options" :value="option.value">{{option.label}}</option>
          </select>
        </span>
        <a @click="doFilter" class="button is-primary">Go</a>
      </div>
    </template>
    <template v-else>
      <p v-if="filter" class="control is-expanded has-addons">
        <input v-model="value" @keyup.enter="doFilter" type="text" class="input" placeholder="Search">
        <a @click="doFilter" class="button is-primary">Go</a>
      </p>
    </template>
    <p v-if="filter" class="control">
      <a @click="resetFilter" class="button">Reset</a>
    </p>
  </div>
</template>

<script>
import FormSelect from '../FormSelect.vue'
export default {
  components: {
    FormSelect
  },
  props: {
    query: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      filter: null,
      value: null
    }
  },
  watch: {
    filter (val) {
      this.value = null
    }
  },
  methods: {
    doFilter () {
      this.$emit('filter', this.filter.field, this.value)
    },
    resetFilter () {
      this.filter = null
      this.value = null
      this.$emit('filter-reset')
      // this.$events.fire('filter-reset')
    }
  }
}
</script>
