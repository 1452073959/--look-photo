import Vue from 'vue'
import App from './App'
// import uView from "uview-ui";
// Vue.use(uView);
Vue.config.productionTip = false

Vue.prototype.$serverUrl = 'https://unidemo.dcloud.net.cn';
Vue.prototype.$loginUrl = 'http://192.168.1.97';

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()