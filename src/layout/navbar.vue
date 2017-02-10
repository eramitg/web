<template>
  <section class="hero is-dark">
    <!-- Hero header: will stick at the top -->
    <div class="hero-head">
      <nav class="nav has-shadow">
        <div class="nav-left">
          <a class="nav-item hero-brand is-flex" href="/">
            <img src="../assets/images/modumlogo_rand.svg">
          </a>
        </div>
        <div class="nav-right is-flex">
          <div class="nav-item"><i class="fa fa-user margin-right"></i>{{user.userName}}  /  {{user.companyName}}</div>
          <div class="nav-item" v-if="user.role != 'USER'"><span class="tag is-warning">{{user.role}}</span></div>
          <a class="nav-item" @click="logout"><i class="fa fa-sign-out"></i> Sign out</a>
        </div>
      </nav>
    </div>
    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <nav class="tabs is-centered is-fullwidth is-boxed">
        <ul>
          <router-link v-for="route in routes" tag="li" :to="route.path" exact v-if="!route.meta || isSuperOrAdmin(route.meta.role)">
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
  import { mapGetters } from 'vuex'
  export default {
    methods: {
      logout(){
        this.$router.push('/login');
        this.$store.commit('logout');
      },
      isSuperOrAdmin(role){
        let userRole = this.user.role;
        if(userRole == 'SUPER') return true;
        if(userRole == 'ADMIN' && (role == 'ADMIN' || role == null)) return true;
        if(userRole == 'USER'){
          if(role == 'ADMIN' || role == 'SUPER') return false;
          if(role == null) return true;
        }
      }
    },
    computed: {
      routes(){
        let route = this.$router.options.routes.find(route => route.path == '/')
        return route ? route.children : []
      },
      ...mapGetters(['user'])
    }
  }
</script>

<style lang="scss" scoped>
  .margin-right {
    margin-right: 10px;
  }
</style>
