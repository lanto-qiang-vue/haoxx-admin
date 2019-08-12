// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { formatMoney, initVer} from '@/libs/util.js'
// import 'iview/dist/styles/iview.css'
// import './index.less'
import '@/assets/icons/iconfont.css'
// import '@/assets/custom.less'
import '@/assets/common.less'
import '@/assets/icons/font-awesome/css/font-awesome.min.css'

// import '@/mock'
// 实际打包时应该不引入mock
import env from '../config/env'
/* eslint-disable */
// env === 'development' ? require('@/mock') : ''

// import axios from '@/libs/api.request'
import axios from '@/libs/axios'
import fly  from '@/libs/fly'
import fxios from '@/libs/fxios'


initVer(1)

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.formatMoney = formatMoney
/**
 * 注册指令
 */
importDirective(Vue)

//全局axios
Vue.prototype.axios = axios;
Vue.prototype.$fly = fly;
Vue.prototype.$fxios = fxios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
