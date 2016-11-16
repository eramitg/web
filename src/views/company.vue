<template>
  <div>
    <button class="button is-primary" @click="doConfirmation">Show Confirm</button>
    <confirm :active="active"></confirm>
  </div>
</template>

<script>
  import Confirm from '../components/Confirm.vue';
  export default{
    components: {
      Confirm
    },
    data(){
      return {
        active: false,
        result: '',
      }
    },
    methods: {
      doConfirmation(){
        this.$store.dispatch('confirm')
          .then(res => console.log('confirm'))
          .catch(err => console.log('cancel'));
      }
    }
  }
</script>