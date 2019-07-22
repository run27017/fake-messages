import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './routes'
import './filters'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './global.css'

Vue.use(VueRouter)
Vue.use(iView)

const router = new VueRouter({
  routes
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

