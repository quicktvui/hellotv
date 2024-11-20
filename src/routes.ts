

// import home from './pages/home/index.vue'
import home from './pages/login/index'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: home,
  },
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: ()=> import('./pages/login/index.vue'),
  // },


]
export default routes
