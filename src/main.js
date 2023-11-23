import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ENV from '../env-config'
Vue.prototype.$ENV = ENV


const vueInstance = () => {
  // debugger
  return new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}
const {
  VUE_APP_KEYCLOAK_OPTIONS_URL: url,
  VUE_APP_KEYCLOAK_OPTIONS_REALM: realm,
  VUE_APP_KEYCLOAK_OPTIONS_CLIENTID: clientId,
  VUE_APP_KEYCLOAK_OPTIONS_ONLOAD: onLoad
} = ENV

import { initKeycloak } from '@/utils/keycloak'
initKeycloak({ url, realm, clientId, onLoad }, vueInstance)

// import  initKeycloak  from '@/utils/keycloayInstall'
// Vue.use(initKeycloak, { url, realm, clientId, onLoad }, vueInstance)
