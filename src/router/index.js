import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

// const Login = () => import( '../components/Login')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'Login',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path:'/home',
    component:Home
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  //to 将要访问的路径，from 从哪个路径跳转过来，next()放行，next('/login')强制跳转
  if(to.path === '/login') return next()
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
  
})

export default router
