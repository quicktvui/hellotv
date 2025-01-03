import home from './pages/home/index.vue'
import detail from './pages/detail/index.vue'

import test from './pages/m-test'

const routes = [
  {
    path: '/test',
    name: 'test',
    component: test
  },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./pages/login/index.vue')
  },
  {
    path: '/filter',
    name: 'filter',
    component: () => import('./pages/filter/expandSidebarContents.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('./pages/search/threeColumns.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: detail
    // component: ()=>import("./pages/detail/index.vue"),
  }
]

export default routes
