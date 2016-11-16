<template>
  <div>
    <router-view></router-view>
    <notifications></notifications>
  </div>
</template>

<script>
  import Notifications from './layout/notifications.vue';
  export default {
    components: {
      Notifications
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