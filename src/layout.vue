<template>
    <router-view></router-view>
</template>

<style lang="scss">
    @import "~bulma/sass/utilities/functions.sass";
    @import "variables";
    @import '~bulma';
</style>

<script>
  import store from './stores'
  export default {
    store
  }
</script>