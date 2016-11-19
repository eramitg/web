<template>
  <div class="control" :class="{'is-horizontal': horizontal}">
    <div :class="{'control-label': horizontal}" v-if="horizontal && label">
      <label class="label">{{label}}</label>
    </div>
    <label class="label" v-else v-if="label">{{label}}</label>
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
