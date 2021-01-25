import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import '@mdi/js'
import MyMixin from '../src/mixins/CustomMethods.js'
import Chart from "chart.js";
import Chartkick from "vue-chartkick";
import './registerServiceWorker'
import VueTour from 'vue-tour'
 
require('vue-tour/dist/vue-tour.css')
 
Vue.use(VueTour)

Vue.use(Chartkick.use(Chart))

Vue.config.productionTip = false
Vue.mixin(MyMixin)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
