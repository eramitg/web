<template>
  <ul>
    <li v-for="tag in tags" class="tag is-primary is-medium">
      {{tag.name}} = {{tag.value}}
      <button class="delete is-small" @click="removeTag(tag)"></button>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true
    }
  },
  methods: {
    removeTag (tag) {
      this.$emit('remove-tag', tag)
    }
  }
}
</script>
