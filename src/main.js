import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/common/styl/index.styl'
import fastclick from 'fastclick' //移动端点透问题
import 'vant/lib/toast/style'
import { Toast } from 'vant'

import httpServe from 'common/js/axios-http.js'




Vue.use(Toast)
Vue.prototype.$Toast = Toast
Vue.config.productionTip = false

Vue.prototype.$http = httpServe // ajax请求方法


fastclick.attach(document.body)
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
