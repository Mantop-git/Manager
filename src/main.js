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

//导入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'

//导入富文本编辑器 依赖
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//使用富文本编辑器作为全局使用
Vue.use(VueQuillEditor /* { default global options } */)


// Vue.use(ZkTable)
Vue.component('tree-table', TreeTable)

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
//注册一个全局过滤器
Vue.filter('dataFormat', function(originVal){
  const dt = new Date(originVal);
  const y =dt.getFullYear();
  //padStart(只用于字符串)当长度不够两位时向前补充字符串'0'
  const m =(dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate()  + '').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
