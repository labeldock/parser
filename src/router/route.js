import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/pages/home').default
    },
    {
      path: '/filters',
      name: 'filters',
      component: require('@/pages/filters').default
    },
    {
      path: '/arguments',
      name: 'arguments',
      component: require('@/pages/arguments').default
    },
    {
      path: '/urls',
      name: 'urls',
      component: require('@/pages/urls').default
    }
  ]
})