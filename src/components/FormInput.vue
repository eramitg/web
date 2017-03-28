<template>
  <div class="control" :class="{'is-horizontal': horizontal}">
    <div v-if="horizontal && label" :class="{'control-label': horizontal}">
      <label class="label">{{label}}</label>
    </div>
    <label v-else-if="label" class="label">{{label}}</label>
    <div class="control" :class="{'has-icon': icon}">
      <input :value="value" @input="updateValue" class="input" :class="{'is-danger': err}" :type="type" :placeholder="placeholder || label.toLowerCase()" :name="name">
      <span v-if="icon" class="icon">
        <i :class="icon"></i>
      </span>
      <span v-if="err" class="help is-danger">{{err}}</span>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'FormInput',
    props: {
      value: {
        required: true
      },
      type: {
        type: String,
        default: 'text'
      },
      label: {
        type: String,
        default: ''
      },
      name: {
        type: String
      },
      placeholder: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      },
      horizontal: {
        type: Boolean,
        default: false
      },
      err: {
        type: String,
        default: ''
      }
    },
    methods: {
      updateValue (event) {
        this.$emit('input', event.target.value)
      }
    }
  }
</script>
