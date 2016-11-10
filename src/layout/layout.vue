<template>
  <div>
    <navbar></navbar>
    <section class="section">
      <div class="container">
        <router-view></router-view>
      </div>
    </section>
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