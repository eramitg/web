import Vue from 'vue'
import App from './app.vue';

import store from './store';
import router from './router';

// check authentication
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(!store.getters.isAuthenticated){
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  }
  next()
});

const app = {
  router,
  store,
  ...App
};

new Vue(app).$mount('#app');