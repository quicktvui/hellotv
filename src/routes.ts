import { ESRouteType } from '@extscreen/es3-router'
import live from './pages/live/index.vue'

const routes = [
  {
    name: 'live',
    path: '/live',
    component: live,
    type: ESRouteType.ES_ROUTE_TYPE_PAGE
  }
]

export default routes
