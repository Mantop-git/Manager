import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入ele插件
import './plugins/element.js'
// 导入全局样式
import './assets/css/globe.css'
// 导入字体图标
import './assets/font/iconfont.css'
//导入axios
import axios from 'axios';

Vue.prototype.$http = axios
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
