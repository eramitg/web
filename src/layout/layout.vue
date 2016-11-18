<template>
  <div>
    <navbar></navbar>
    <section class="section app">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
  import Navbar from './navbar.vue';
  export default {
    components: {
      Navbar
    }
  }
</script>

<style lang="scss" scoped>
  @import "../variables";

  .app{
    background-color: $light
  }
</style>