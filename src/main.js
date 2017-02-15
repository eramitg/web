// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import VeeValidate from 'vee-validate'
import VueProgressBar from 'vue-progressbar'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '2px'
})

// check authentication
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.beforeEach(async (to, from, next) => {
  let obj = to.matched.find(record => record.meta.role)
  let role = obj ? obj.meta.role : null
  let access = await store.dispatch('checkAccess', role)
  if (access) {
    next()
  } else {
    next({path: '/403'})
  }
})

// handle connection errors
axios.interceptors.response.use(res => (res), (error) => {
  let {response} = error
  if (response.data && response.data.message) {
    store.dispatch('notify', {text: response.data.message, type: 'danger'})
  } else if (response.data) {
    store.dispatch('notify', {text: response.data, type: 'danger'})
  }
  return error
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
