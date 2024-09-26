import { ESRouteType } from '@extscreen/es3-router'
import liveMenu from './pages/live/components/menu/index.vue'

const routes = [
  {
    name: 'liveMenu',
    path: '/live/menu',
    component: liveMenu,
    type: ESRouteType.ES_ROUTE_TYPE_PAGE
  }
]

export default routes
