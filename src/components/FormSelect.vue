<template>
  <div class="control" :class="{'is-horizontal': horizontal}">
    <div v-if="horizontal && label" :class="{'control-label': horizontal}">
      <label class="label">{{label}}</label>
    </div>
    <label v-else-if="label" class="label">{{label}}</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select :value="value" @input="updateValue">
          <option v-for="option in finalOptions" :value="option.value">{{option.label}}</option>
        </select>
      </div>
      <span v-if="err" class="help is-danger">{{err}}</span>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      value: {
        required: true
      },
      options: {
        type: Array,
        default: () => [],
        required: true
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
      },
      err: {
        type: String,
        default: ''
      }
    },
    computed: {
      finalOptions () {
        return this.options.map(item => (typeof item === 'string' ? {label: item, value: item} : item))
      }
    },
    methods: {
      updateValue (event) {
        this.$emit('input', event.target.value)
      }
    }
  }
</script>
