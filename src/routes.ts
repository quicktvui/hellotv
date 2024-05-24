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
import activity2 from './pages/activity2/index.vue'
import my from './pages/my/index.vue'

const routes = [
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
    name: 'my', path: '/my', component: my
  }
]
export default routes
