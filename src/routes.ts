import home from './pages/home/index.vue'
import detail from './pages/detail/index.vue'
import introduction from './pages/introduction/index.vue'
import {ESRouteType} from "@extscreen/es3-router";
import screenList from './pages/filter/index.vue'
import search from './pages/search/index.vue'
import web from './pages/web/index.vue'
import live from './pages/live/index.vue'
import settings from './pages/settings/index.vue'
import networkError from './components/NetworkError.vue'
import history from './pages/history/history_template.vue'
import login from './pages/login/index.vue'
import activity2 from './pages/activity2/index.vue'
import my from './pages/my/index.vue'
import detail2 from './pages/detail2/index.vue'
import D2Introduction from './pages/detail2/D2Introduction.vue'
import ranking from './pages/ranking/index.vue'
import shortVideo from './pages/shortVideo/index.vue'
import test from './pages/test.vue'


const routes = [
  {
    path: '/test',
    name: 'test',
    component: test,
  },
  {
    path: '/home',
    name: 'home',
    component: home,
  },
  {
    path: '/series_view',
    name: 'series_view',
    component: detail,
  },
  {
    path: '/introduction',
    name: 'introduction',
    component: introduction,
    type: ESRouteType.ES_ROUTE_TYPE_DIALOG
  },
  {
    path: '/screen_main_view',
    name: 'screen_main_view',
    component: screenList,
  },
  {
    path: '/search',
    name: 'search',
    component: search
  },
  {
    path: '/load_web_view',
    name: 'load_web_view',
    component: web
  },
  {
    name: 'live', path: '/live', component: live
  },
  {
    name: 'activity2', path: '/activity2', component: activity2
  },
  {
    name: 'settings', path: '/settings', component: settings, type: ESRouteType.ES_ROUTE_TYPE_DIALOG
  },
  {
    name: 'network', path: '/network', component: networkError, type: ESRouteType.ES_ROUTE_TYPE_DIALOG
  },
  {
    name: 'history', path: '/history', component: history
  },
  {
    name:'login',path:'/login',component: login
  },
  {
    name: 'my', path: '/my', component: my
  },
  {
    name: 'detail2', path: '/detail2', component: detail2
  },
  {
    name: 'ranking', path: '/ranking', component: ranking
  }
  ,
  {
    name: 'short_video', path: '/short_video', component: shortVideo
  },
  {
    path: '/d2Introduction', name: 'd2Introduction', component: D2Introduction,
    type: ESRouteType.ES_ROUTE_TYPE_DIALOG
  },
]
export default routes
