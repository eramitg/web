<template>
  <aside class="menu hero is-fullheight is-hidden-mobile has-shadow">
    <ul class="menu-list">
      <li v-for="route in routes">
        <router-link :to="route.path">
          <span class="icon is-small"><i :class="['fa', route.meta.icon]"/></span>
          {{route.meta.label || route.name}}
        </router-link>
      </li>
    </ul>
  </aside>
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