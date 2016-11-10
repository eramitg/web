<template>
  <section class="hero is-medium4">
    <!-- Hero header: will stick at the top -->
    <div class="hero-head">
      <nav class="nav has-shadow">
        <div class="nav-left">
          <a class="nav-item is-hidden-tablet" @click="$store.dispatch('TOGGLE_SIDEBAR')">
            <i class="fa fa-bars"></i>
          </a>
        </div>
        <div class="nav-center">
          <a class="nav-item hero-brand" href="/">
            <img src="../assets/images/logo.svg">
          </a>
        </div>
        <div class="nav-right is-flex">
          <a class="nav-item" @click="$store.dispatch('logout')"><i class="fa fa-sign-out"></i> Sign out</a>
        </div>
      </nav>
    </div>
    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <nav class="tabs is-centered">
        <ul>
          <router-link v-for="route in routes" tag="li" :to="route.path">
            <a>
              <span class="icon is-small" v-if="route.meta && route.meta.icon"><i :class="['fa', route.meta.icon]"></i></span>
              <span>{{route.meta.label || route.name}}</span>
            </a>
          </router-link>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script>
  export default {
    computed: {
      routes(){
        let route = this.$router.options.routes.find(route => route.path == '/')
        return route ? route.children : []
      }
    }
  }
</script>