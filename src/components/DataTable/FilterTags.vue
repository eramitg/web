<template>
  <nav class="level" v-if="Object.keys(tags).length">
    <div class="level-left">
      <div v-for="value, key in tags" class="level-item">
        <div class="tag is-primary is-medium">
          {{replaceNames(key, value)}}
          <button class="delete is-small" @click="removeTag(key)"></button>
        </div>
      </div>
    </div>
  </nav>
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
            return option ? option.label : ''
          })
          return `${obj.name} = ${names}`
        } else {
          let option = obj.options.find(item => {
            return item.value === value
          })
          if (option) {
            return `${obj.name} = ${option.label}`
          } else {
            return `${obj.name} = ${value}`
          }
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
