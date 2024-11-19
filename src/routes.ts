import home from './pages/home/index.vue'
import {ESRouteType} from "@extscreen/es3-router";

const routes = [
  {
    path: '/test',
    name: 'test',
    component: () => import('./pages/test.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: home,
  },
  {
    path: '/series_view',
    name: 'series_view',
    component: () => import('./pages/detail/index.vue'),
  },
  {
    path: '/introduction',
    name: 'introduction',
    component: () => import('./pages/introduction/index.vue'),
    type: ESRouteType.ES_ROUTE_TYPE_DIALOG
  },
  {
    path: '/screen_main_view',
    name: 'screen_main_view',
    component: () => import('./pages/filter/index.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('./pages/search/index.vue')
  },
  {
    path: '/load_web_view',
    name: 'load_web_view',
    component: () => import('./pages/web/index.vue')
  },
  {
    name: 'live', path: '/live', component: () => import('./pages/live/index.vue')
  },
  {
    name: 'activity2', path: '/activity2', component: () => import('./pages/activity2/index.vue')
  },
  {
    name: 'settings', path: '/settings', component: () => import('./pages/settings/index.vue'), type: ESRouteType.ES_ROUTE_TYPE_DIALOG
  },
  {
    name: 'network', path: '/network', component: () => import('./components/NetworkError.vue'), type: ESRouteType.ES_ROUTE_TYPE_DIALOG
  },
  {
    name: 'history', path: '/history', component: () => import('./pages/history/history_template.vue')
  },
  {
    name:'login',path:'/login',component: () => import('./pages/login/index.vue')
  },
  {
    name: 'my', path: '/my', component: () => import('./pages/my/index.vue')
  },
  {
    name: 'detail2', path: '/detail2', component: () => import('./pages/detail2/index.vue')
  },
  {
    name: 'ranking', path: '/ranking', component: () => import('./pages/ranking/index.vue')
  }
  ,
  {
    name: 'short_video', path: '/short_video', component: () => import('./pages/shortVideo/index.vue')
  },
  {
    path: '/d2Introduction', name: 'd2Introduction', component: () => import('./pages/detail2/D2Introduction.vue'),
    type: ESRouteType.ES_ROUTE_TYPE_DIALOG
  },
]
export default routes
