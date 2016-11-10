<template>
  <div>
    <button class="button is-primary" @click="add">Go Message</button>
  </div>
</template>

<script>
  export default {
    methods: {
      add(){
        this.$store.dispatch('addNotification', {text: 'Hi', color: 'success'})
      }
    }
  }
</script>