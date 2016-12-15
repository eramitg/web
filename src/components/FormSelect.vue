<template>
  <div class="control" :class="{'is-horizontal': horizontal}">
    <div v-if="horizontal && label" :class="{'control-label': horizontal}">
      <label class="label">{{label}}</label>
    </div>
    <label v-else-if="label" class="label">{{label}}</label>
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
      },
      horizontal: {
        type: Boolean,
        default: false
      }
    },
    methods:{
      updateValue(event){
        this.$emit('input', event.target.value)
      }
    }
  }
</script>
