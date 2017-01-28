import Vue from 'vue';
import VueRouter from 'vue-router';

const Layout = () => System.import('./layout/layout.vue');

function lazyLoad (component) {
  return () => System.import(`./views/${component}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
  base: __dirname,
  linkActiveClass: 'is-active',
  routes: [
    {path: '/', component: Layout, meta: {requiresAuth: true}, children: [
      {path: '/', name: 'Dashboard', component: lazyLoad('dash'), meta: {icon: 'fa-home'}},
      {path: '/shipment', name: 'Shipment', component: () => System.import('./views/shipment'), meta: {icon: 'fa-paper-plane'}},
      {path: '/user', name: 'User', component: lazyLoad('user'), meta: {icon: 'fa-users', role: 'ADMIN'}},
      {path: '/company', name: 'Company Management', component: lazyLoad('company'), meta: {icon: 'fa-cog', role: 'ADMIN'}},
      {path: '/blockchain', name: 'Blockchain', component: lazyLoad('blockchain'), meta:{icon: 'fa-book', role: 'SUPER'}},
      //{path: '*', component: NotFound}
    ]},
    {path: '/login', component: lazyLoad('login')},
    {path: '/403', component: lazyLoad('403')},
    {path: '*', component: lazyLoad('404')},
  ]
});

export default router;
