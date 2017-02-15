<template>
  <div id="app">
    <router-view></router-view>
    <snackbar></snackbar>
    <confirm></confirm>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import Snackbar from './layout/Snackbar.vue'
import Confirm from './layout/Confirm.vue'
export default {
  name: 'app',
  components: {
    Confirm,
    Snackbar
  },
  mounted () {
    this.$Progress.finish()
  },
  created () {
    const token = localStorage.getItem('token')
    if (token) {
      this.$store.commit('setToken', token)
    }

    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start()
      next()
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })
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
