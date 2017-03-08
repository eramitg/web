<template>
  <input class="input" type="text" :value="value" @input="input" :name="name">
</template>

<script>
  import Flatpickr from 'flatpickr'

  export default{
    data () {
      return {
        fp: null
      }
    },
    props: {
      options: {
        type: Object,
        default: () => ({
          dateFormat: 'd/m/Y'
          // enableTime: true,
          // time_24hr: true
        })
      },
      value: {
        type: String,
        default: ''
      },
      name: {
        type: String
      }
    },
    methods: {
      input (event) {
        this.$emit('input', event.target.value)
      }
    },
    mounted () {
      if (!this.fp) {
        this.fp = new Flatpickr(this.$el, this.options)
      }
    },
    destroyed () {
      if (this.fp) {
        this.fp.destroy()
        this.fp = null
      }
    }
  }
</script>

<style scoped>
  @import "~flatpickr/dist/themes/material_green.css";
</style>
