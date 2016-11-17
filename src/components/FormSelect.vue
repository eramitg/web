<template>
  <div class="control is-horizontal">
    <div class="control-label" v-if="label">
      <label class="label">{{label}}</label>
    </div>
    <div class="control">
      <div class="select is-fullwidth">
        <select :value="value" @input="updateValue">
          <option v-for="option in options">{{option}}</option>
        </select>
      </div>
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
      options: {
        type: Array,
        default: () => [],
        required: true,
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
