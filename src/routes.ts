import home from './pages/home/index.vue'

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
  }
]

export default routes
