<template>
  <ul>
    <li v-for="value, key in tags" class="tag is-primary is-medium">
      {{replaceNames(key, value)}}
      <button class="delete is-small" @click="removeTag(key)"></button>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tags: {
      type: Object,
      required: true
    },
    query: {
      type: Array,
      required: true
    }
  },
  methods: {
    replaceNames (key, value) {
      let obj = this.query.find(item => {
        return item.field === key
      })
      if (obj && obj.options) {
        if (Object.prototype.toString.call(value) === '[object Array]') {
          let names = value.map(val => {
            let option = obj.options.find(item => {
              return item.value === val
            })
            return option.label
          })
          return `${obj.name} = ${names}`
        } else {
          let option = obj.options.find(item => {
            return item.value === value
          })
          return `${obj.name} = ${option.label}`
        }
      }
      return `${obj.name} = ${value}`
    },
    removeTag (key) {
      this.$emit('remove-tag', key)
    }
  }
}
</script>
