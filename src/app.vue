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
  @import '~animate.css';
  .animated {
    animation-duration: .5s;
  }

  @import "~bulma/sass/utilities/functions.sass";
  @import "variables";
  @import '~bulma';

  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome';
</style>