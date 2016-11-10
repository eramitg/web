import Vue from 'vue';
import VueRouter from 'vue-router';

import Layout from './layout/layout.vue';

import Dash from './views/dash.vue';
import Shipment from './views/shipment.vue';
import User from './views/user.vue';
import Company from './views/company.vue';
import Blockchain from './views/blockchain.vue';
import Login from './views/login.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  base: __dirname,
  linkActiveClass: 'is-active',
  routes: [
    {path: '/', component: Layout, meta: {requiresAuth: true}, children: [
      {path: '/', name: 'Dashboard', component: Dash, meta: {icon: 'fa-home'}},
      {path: '/shipment', name: 'Shipment', component: Shipment, meta: {icon: 'fa-paper-plane'}},
      {path: '/user', name: 'User', component: User, meta: {icon: 'fa-users', role: 'ADMIN'}},
      {path: '/company', name: 'Company Management', component: Company, meta: {icon: 'fa-cog', role: 'ADMIN'}},
      {path: '/blockchain', name: 'Blockchain', component: Blockchain, meta:{icon: 'fa-book', role: 'SUPER'}},
    ]},
    {path: '/login', component: Login}
  ]
});

export default router;