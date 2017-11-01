// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueNotify from 'vue-notifyjs'
import VeeValidate from 'vee-validate'
import App from './App'
import router from './router'
import lang from 'element-ui/lib/locale/lang/fr'
import locale from 'element-ui/lib/locale'
import VueMoment from 'vue-moment'
import GlobalComponents from './gloablComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/SidebarPlugin'
import moment from 'moment'
import 'moment/locale/fr'
// library imports

import './assets/sass/paper-dashboard.scss'
import './assets/sass/demo.scss'
import 'es6-promise/auto'

import ElementUI from 'element-ui'
import sidebarLinks from './sidebarLinks'

import store from '@/vuex/index'

Vue.config.productionTip = false
Vue.use(VueMoment, {moment})
Vue.use(ElementUI)
Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify)
Vue.use(SideBar, {sidebarLinks: sidebarLinks})
Vue.use(VeeValidate)
locale.use(lang)

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
