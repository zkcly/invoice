import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment';

import Print from '@/utils/print'
moment.locale('zh-cn');
Vue.prototype.$moment = moment;
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import globals from './utils/global.js'

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts



import App from './App'
import store from './store'
import router from './router'

import IdleVue from "idle-vue";
// import Plugin from 'v-fit-columns';

 

import '@/icons' // icon
// import '@/permission' // permission control

/**npm install --save moment
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}



// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// ElementUI.Dialog.props.lockScroll.default = false;
Vue.use(ElementUI)
Vue.use(globals)

Vue.use(Print)

// Vue.use(Plugin)

Vue.config.productionTip = false

const eventsHub = new Vue();
// const baseSet = localStorage.getItem("initSetBase") ? JSON.parse(localStorage.getItem("initSetBase")): '';
const baseSet = localStorage.getItem("initSetBase") ? JSON.parse(localStorage.getItem("initSetBase")).exitTime: 86400;
console.log(baseSet)
console.log(store.state)
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  store,
  // idleTime: 1000 * 3,
  idleTime: 1000 * 60 * baseSet,
  // idleTime: 3000 * (store.state.settings.exitTime),
  startAtIdle: false
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
