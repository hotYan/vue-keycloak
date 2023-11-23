import Keycloak from 'keycloak-js'
import { getToken } from '@/utils/auth'
import store from '@/store'

/**
 * 引入keycloak，初始化keycloak
 * @param { object } url, realm, clientId, onLoad初始化的参数
 * @param { function } cb 挂载vue实例
 * @returns {string | null}
 */
const initKeycloak = {
  install(Vue, { url, realm, clientId, onLoad }, cb) {
    const keycloak = Keycloak({ url, realm, clientId, onLoad })
    keycloak.init({ checkLoginIframe: false, onLoad }).then(async authenticated => {
      console.log('keycloak:', keycloak)
      Vue.prototype.$keycloak = keycloak
      if (authenticated) { // 已经登录
        await store.dispatch('user/keycloakLogin', keycloak.token)
      } else { // 未登录：分情况处理
        if (onLoad === 'check-sso') { // 不登录也可以访问
          if (getToken()) { // 存在token，清除token
            await store.dispatch('user/resetToken')
          }
        } else { // 必须登录，重定向到登录界面
          window.location.reload()
          return
        }
      }
      if (onLoad === 'login-required') {
        setInterval(() => {
          keycloak.updateToken(70).then(async(refreshed) => {
            if (refreshed) { // 刷新成功，更新token
              await store.dispatch('user/keycloakLogin', keycloak.token)
            } else {
              console.log('Token not refreshed')
            }
          }).catch(error => {
            console.log('Failed to refresh token', error)
          })
        }, 2000)
      }
      cb && cb()
    }).catch(error => {
      console.log('Authenticated Failed', error)
    })
  }
}

export default initKeycloak
