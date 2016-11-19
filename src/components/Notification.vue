<template>
  <div class="notification" :class="classObject">
    <button class="delete" @click="close" v-if="closeable"></button>
    <slot></slot>
  </div>
</template>

<script>
  export default{
    props: {
      type: {
        type: String,
        default: 'white'
      },
      closeable: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      classObject(){
        return this.type ? `is-${this.type}` : '';
      }
    },
    methods: {
      close(){
        this.$emit('close');
      }
    }
  }
</script>