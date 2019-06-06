// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import Lockr from 'lockr'
import Cookies from 'js-cookie'
import _ from 'lodash'
import moment from 'moment'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'common/font/iconfont.css'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
// 引入 vue-kindeditor 需要的文件
import VueKindEditor from 'vue-kindeditor'
import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'

//axios全局拦截器
Vue.prototype.$axios = axios
axios.interceptors.request.use(function (config) {
  if (store.state.authKey) {
    config.headers.authKey = Lockr.get('authKey')
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

// axios.defaults.baseURL = HOST
axios.defaults.headers.authKey = Lockr.get('authKey')
axios.defaults.headers.sessionId = Lockr.get('sessionId')

// window.HOST = HOST
window.Lockr = Lockr
window.Cookies = Cookies
window.axios = axios
window._ = _
window.moment = moment

Vue.use(Element)
Vue.use(iView);
Vue.use(VueKindEditor);

Vue.config.productionTip = false

/* eslint-disable no-new */

const bus = new Vue()
window.bus = bus

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  render: h => h(App)
})
