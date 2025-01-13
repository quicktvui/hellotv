import { ESRouteType } from '@extscreen/es3-router'
import home from './pages/home/index.vue'
import detail from './pages/detail/index.vue'
import test from './pages/m-test.vue'

// 筛选布局模式选择
import filterConfig from './pages/filter/config'
const filter = () => {
  switch (filterConfig.layoutMode) {
    case 1:
      return import('./pages/filter/single-contents.vue')
    case 2:
      return import('./pages/filter/sidebar-contents.vue')
    case 3:
      return import('./pages/filter/expand-sidebar-contents.vue')
  }
}

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
    component: filter
  },
  {
    path: '/filter',
    name: 'screen_main_view',
    component: filter
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('./pages/search/three-columns.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: detail
    // component: ()=>import("./pages/detail/index.vue"),
  },
  {
    path: '/detail',
    name: 'series_view',
    component: detail
    // component: ()=>import("./pages/detail/index.vue"),
  },

  {
    path: '/introduction',
    name: 'introduction',
    component: () => import('./pages/introduction/index.vue'),
    type: ESRouteType.ES_ROUTE_TYPE_DIALOG
  },
  {
    path: '/detail-full-screen',
    name: 'detail-full-screen',
    component: () => import('./pages/detail-full-screen/index.vue')
  }
]

export default routes
