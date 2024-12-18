import home from './pages/home/index.vue'
import detail from './pages/detail/index.vue'

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
    component: () => import('./pages/filter/index.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: detail,
    // component: ()=>import("./pages/detail/index.vue"),
  }


]

export default routes
