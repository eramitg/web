<template>
  <div id="app">
    <router-view></router-view>
    <snackbar></snackbar>
    <confirm></confirm>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import Vue from 'vue'
import Snackbar from './layout/Snackbar.vue'
import Confirm from './layout/Confirm.vue'
import store from './store'
import router from './router'
export default {
  name: 'app',
  components: {
    Confirm,
    Snackbar
  },
  beforeCreate () {
    Vue.http.get('statistics')
    .catch(() => {
      store.commit('logout')
      router.push('/login')
    })
  },
  mounted () {
    this.$Progress.finish()
  },
  created () {
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

  $sizes: (1,1.5,2,3,5,10);
  $positions: ('top','left','bottom','right');

  @each $size in $sizes {
    @each $position in $positions {
      .spacer-margin-#{$position}-#{$size} {
        margin-#{$position}: $size + rem;
      }

      .spacer-padding-#{$position}-#{$size} {
        padding-#{$position}: $size + rem;
      }
    }

    .spacer-margin-#{$size} {
      margin: $size + rem;
    }
    .spacer-padding-#{$size} {
      padding: $size + rem;
    }
  }


  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome';
</style>
