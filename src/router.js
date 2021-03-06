import Vue from 'vue'
import Router from 'vue-router'

const Layout = () => System.import('./layout/Layout')

function lazyLoad (component) {
  return () => System.import(`./views/${component}`)
}

Vue.use(Router)

export default new Router({
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      component: Layout,
      meta: {requiresAuth: true},
      children: [
        {path: '/', name: 'Dashboard', component: lazyLoad('dash'), meta: {icon: 'fa-home'}},
        {path: '/shipment', name: 'Shipments', component: () => System.import('./views/shipment'), meta: {icon: 'fa-paper-plane'}},
        {path: '/detail/:id', name: 'Detail', component: () => System.import('./views/detail')},
        // {path: '/preparedshipments', name: 'Prepared Shipments', component: lazyLoad('preparedshipments'), meta: {icon: 'fa-archive'}},
        {path: '/user', name: 'Users', component: lazyLoad('user'), meta: {icon: 'fa-users', role: 'ADMIN'}},
        {path: '/company', name: 'Company Management', component: lazyLoad('company'), meta: {icon: 'fa-cog', role: 'SUPER'}},
        {path: '/blockchain', name: 'Blockchain', component: lazyLoad('blockchain'), meta: {icon: 'fa-book', role: 'SUPER'}}
      ]
    },
    {path: '/login', component: lazyLoad('login')},
    {path: '/403', component: lazyLoad('403')},
    {path: '*', component: lazyLoad('404')}
  ]
})
