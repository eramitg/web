//require('expose?$!expose?jQuery!jquery');
//require("bootstrap-webpack");

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'


Vue.use(VueRouter)
Vue.use(VueResource)


import Login from './login.vue'
import User from './user.vue'
import Dash from './dash.vue'
import App from './app.vue'
import Company from './company.vue'
import Shipment from './shipment.vue'
import Blockchain from './blockchain.vue'

import Login2 from './views/login.vue';
import Layout from './layout.vue';

Vue.component('login', Login)


Layout.router = new VueRouter({
    base: __dirname,
    routes: [
        /*{path: '/', component: App, children: [
            //{path: '/', component: Dash},
            //{path: '/shipment', component: Shipment},
            //{path: '/user', component: User},
            //{path: '/company', component: Company},
            //{path: '/blockchain', component: Blockchain},
        ]},*/
        {path: '/login', component: Login2}
    ]
})

new Vue(Layout).$mount('#app')