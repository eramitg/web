// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import VeeValidate from 'vee-validate'
import VueProgressBar from 'vue-progressbar'
import axiosPlugin from './axiosPlugin'
import axios from 'axios'
import qs from 'qs'

import Card from './components/Card.vue'
Vue.component('card', Card)

Vue.use(axiosPlugin)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '2px'
})

// Set the base endpoint of axios
Vue.http.defaults.baseURL = process.env.API_ROOT
axios.defaults.paramsSerializer = function (params) {
  return qs.stringify(params, {arrayFormat: 'repeat'})
}

const token = localStorage.getItem('token')
if (token) {
  store.commit('setToken', token)
}

const user = localStorage.getItem('user')
if (user) {
  store.commit('setUser', JSON.parse(user))
}

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
