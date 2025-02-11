import { ESRouteType } from '@extscreen/es3-router'

// 筛选布局模式选择
import filterConfig from './pages/filter/config'
import home from './pages/home/index.vue'
// import detail from './pages/detail/index.vue'
import test from './pages/m-test.vue'
import playTest from  './pages/play-test.vue'
// 搜索布局模式选择
import searchConfig from './pages/search/config'

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

const search = () => {
  switch (searchConfig.layoutMode) {
    case 2:
      return import('./pages/search/two-columns.vue')
    case 3:
      return import('./pages/search/three-columns.vue')
  }
}

const routes = [
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
    path: '/search',
    name: 'search',
    component: search
  },
  {
    path: '/detail',
    name: 'detail',
    // component: detail
    component: () => import('./pages/detail/index.vue')
  },
  {
    path: '/detail-old',
    name: 'series_view',
    // component: detail
    component: () => import('./pages/detail/index.vue')
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
  },
  { name: 'history', path: '/history', component: () => import('./pages/history/index.vue') },
  {
    name: 'confirm',
    path: '/confirm',
    component: () => import('./pages/history/components/confirm-dialog.vue')
  },

  {
    path: '/exit-dialog',
    name:'exit_dialog',
    component: ()=> import('./pages/home/components/exit-dialog.vue'),
    type:ESRouteType.ES_ROUTE_TYPE_DIALOG
  },

  {
    path: '/test',
    name: 'test',
    component: test
  },
  {
    path:'/playTest',
    name:'playTest',
    component: playTest
  }
]

export default routes
