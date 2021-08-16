import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/login/Login.vue'
import Home from 'components/home/Home.vue'
import Welcome from 'components/welcome/Welcome.vue'
import Users from 'components/user/Users.vue'
import Rights from 'components/power/Rights.vue'
import Roles from 'components/power/Roles.vue'
import Cate from 'components/goods/Cate.vue'
import Params from 'components/goods/Params.vue'
import List from 'components/goods/List.vue'
import Add from 'components/goods/Add.vue'
import Order from 'components/order/Order.vue'
import Reports from 'components/report/Reports.vue'

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
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [ 
      {
        //注册路由以后一定要记得加占位符
        path: '/welcome',
        component: Welcome,
      },
      {
        path:'/users',
        component:Users
      },
      {
        path:'/rights',
        component :Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      //商品分类
      {
        path: '/categories',
        component: Cate
      },
      //商品分类参数
      {
        path:'/params',
        component:Params
      },
      //商品列表
      {
        path: '/goods',
        component: List
      },
      //商品添加
      {
        path: '/goods/add',
        component: Add

      },
      //订单
      {
        path: '/orders',
        component: Order
      },
      //数据统计
      {
        path:'/reports',
        component: Reports
      }
    ]
  },

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  //to 将要访问的路径，from 从哪个路径跳转过来，next()放行，next('/login')强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()

})

export default router
