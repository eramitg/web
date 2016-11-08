<template>
  <div>
    <navbar></navbar>
    <div class="columns">
      <sidebar class="column is-2"/>
      <div class="column is-10 content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Navbar from './navbar.vue';
  import Sidebar from './sidebar.vue';
  export default {
    components: {
      Navbar,
      Sidebar
    }
  }
</script>

<style lang="scss" scoped>
  .content{
    padding: 30px;
  }
</style>