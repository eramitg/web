import Vue from 'vue';
import VueRouter from 'vue-router';

import Layout from './layout/layout.vue';

const Login = resolve => require(['./views/login.vue'], resolve);
const Dash = resolve => require(['./views/dash.vue'], resolve);
const Shipment = resolve => require(['./views/shipment.vue'], resolve);
const User = resolve => require(['./views/user.vue'], resolve);
const Company = resolve => require(['./views/company.vue'], resolve);
const Blockchain = resolve => require(['./views/blockchain.vue'], resolve);
const NotFound = resolve => require(['./views/404.vue'], resolve);
const Denied = resolve => require(['./views/403.vue'], resolve);

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
      //{path: '*', component: NotFound}
    ]},
    {path: '/login', component: Login},
    {path: '/403', component: Denied},
    {path: '*', component: NotFound},
  ]
});

export default router;