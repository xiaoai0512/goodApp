import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/common/styl/index.styl'
import fastclick from 'fastclick' //移动端点透问题
import { Toast, Button, DatetimePicker, Popup, Tab, Tabs, Dialog, Field , Grid, GridItem, NavBar, Stepper , Form, Icon, Loading, Overlay } from 'vant'
// import 'vant/lib/toast/style'
import httpServe from 'common/js/axios-http.js'

Vue.use(Popup)
Vue.use(DatetimePicker)
Vue.use(Toast)
Vue.use(Button)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Dialog)
Vue.use(Field)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(NavBar)
Vue.use(Stepper)
Vue.use(Button)
Vue.use(Form)
Vue.use(Icon)
Vue.use(Loading)
Vue.use(Overlay)


Vue.prototype.$Toast = Toast
Vue.config.productionTip = false

Vue.prototype.$http = httpServe // ajax请求方法

fastclick.attach(document.body)
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
