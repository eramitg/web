<template>
  <div class="notification" :class="classObject">
    <button class="delete" @click="close"></button>
    <slot></slot>
  </div>
</template>

<script>
  export default{
    props: {
      color: {
        type: String,
        default: ''
      }
    },
    computed: {
      classObject(){
        return this.color ? `is-${this.color}` : '';
      }
    },
    methods: {
      close(){
        this.$emit('close');
      }
    }
  }
</script>