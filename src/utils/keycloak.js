/* eslint-disable no-undef */

import Keycloak from 'keycloak-js'
import Vue from 'vue'
import { getToken, setToken, removeToken } from '@/utils/auth'
import store from '@/store'

/**
 * 引入keycloak，初始化keycloak
 * @param { object } url, realm, clientId, onLoad初始化的参数
 * @param { function } cb 挂载vue实例
 * @returns {string | null}
 */
export function initKeycloak({ url, realm, clientId, onLoad }, cb) {
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
/**
 * keycloak 登录：设置token的值，将token保存到cookie
 * @param { string } token token
 * @param { function } cb 相关功能代码
 * @returns { Promise }
 */
export function login(token, cb) {
  return new Promise((resolve) => {
    setToken(token)
    cb && cb()
    resolve()
  })
}
/**
 * 获取keycloak信息 ：获取用户信息
 * @param { function } cb 相关功能代码
 * @returns { Promise }
 */
export function getInfo(cb) {
  return new Promise((resolve, reject) => {
    const keycloak = Vue.prototype.$keycloak
    if (!keycloak) {
      reject('keycloak not init')
    }

    if (!keycloak.authenticated) {
      reject('Verification failed, please Login again.')
    }
    cb && cb()
    resolve()
  })
}

/**
 * keycloak 登出：清除token的值，将token从cookie移除
 * @param { function } cb 相关功能代码
 * @returns { Promise }
 */
export function logout(cb) {
  return new Promise((resolve) => {
    Vue.prototype.$keycloak.logout().then(() => {
      removeToken()
      cb && cb()
      resolve()
    })
  })
}

/**
 * 清除token ：清除token的值，将token从cookie移除
 * @param { function } cb 相关功能代码
 * @returns { Promise }
 */
export function clearToken(cb) {
  return new Promise((resolve) => {
    removeToken()
    cb && cb()
    resolve()
  })
}

