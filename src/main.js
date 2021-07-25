import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入ele插件
import './plugins/element.js'
// 导入全局样式
import './assets/css/globe.css'
// 导入iconfont外部图标图片，必定导入
import './assets/font/iconfont.css'
//导入axios
import axios from 'axios';

Vue.prototype.$http = axios
//通过axios.intercepteors.request.use(config=>{}) 进行拦截请求相当于对当前网络请求预处理
axios.interceptors.request.use(config => {
  //为请求头添加token 验证的Authorization的字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //一定要返回config
  return config
})
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 设置axios的根路径 都是基于根路径进行网络请求
// Vue.prototype.axios = axios
// 一个this.$http.post(url,) 另一个this.axios.post(url,)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
