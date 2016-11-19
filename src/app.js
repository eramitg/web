import Vue from 'vue'
import App from './app.vue';

import store from './store';
import router from './router';
import axios from 'axios';

import VueTables from 'vue-tables-2';
import VeeValidate from 'vee-validate';
import VueProgressBar from 'vue-progressbar'


Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '2px'
})

Vue.use(VueTables.client);
Vue.use(VeeValidate);

// check authentication
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(!store.getters.isAuthenticated){
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
});


router.beforeEach(async (to, from, next) => {
  let obj = to.matched.find(record => record.meta.role);
  let role = obj ? obj.meta.role : null;
  let access = await store.dispatch('checkAccess', role);
  if(access){
    next();
  } else {
    next({path: '/403'})
  }
});


// handle connection errors
axios.interceptors.response.use(res => (res), (error) => {
  let {response} = error;
  if (response.data && response.data.message){
    store.dispatch('notify', {text: response.data.message, type: 'danger'});
  } else if(response.data){
    store.dispatch('notify', {text: response.data, type: 'danger'});
  }
  return error
})

const app = {
  router,
  store,
  ...App
};

new Vue(app).$mount('#app');