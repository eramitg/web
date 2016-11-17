<template>
  <div class="control is-horizontal">
    <div class="control-label" v-if="label">
      <label class="label">{{label}}</label>
    </div>
    <div class="control">
      <input :value="value" @input="updateValue" class="input" :type="type" :placeholder="placeholder">
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      value: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'text',
      },
      label: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    methods:{
      updateValue(event){
        this.$emit('input', event.target.value)
      }
    }
  }
</script>
