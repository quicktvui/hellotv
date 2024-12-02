
import home from './pages/home/index'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: home,
  },
  {
    path: '/login',
    name: 'login',
    component: ()=>import("./pages/login/index"),
  },


]
export default routes
