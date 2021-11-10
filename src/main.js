import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueLazyLoad from 'vue-lazyload'

// 滑块验证插件
import SlideVerify from 'vue-monoplasty-slide-verify'

// 引入element
import './plugins/element.js'

// 引入阿里巴巴矢量图标库
import './assets/iconfont/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

// Vuex
import store from './store'

// 引入封装请求后的axios
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'

// 引入vue-lazyload插件
Vue.use(VueLazyLoad, {
  error: require('./assets/static/imageerror.png'),
  loading: require('./assets/static/imageloading.png')
})

// 使用滑块验证插件
Vue.use(SlideVerify)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
