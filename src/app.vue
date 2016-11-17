<template>
  <div>
    <router-view></router-view>
    <snackbar></snackbar>
    <confirm></confirm>
  </div>
</template>

<script>
  import Snackbar from './layout/Snackbar.vue';
  import Confirm from './layout/Confirm.vue';
  export default {
    components: {
      Confirm,
      Snackbar
    }
  }
</script>

<style lang="scss">
  @import "./variables";
  @import '~bulma';

  @import '~animate.css';
  .animated {
    animation-duration: .5s;
  }


  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome';
</style>