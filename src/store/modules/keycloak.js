import Vue from 'vue'
import {
  getToken
  // setToken,removeToken
} from '@/utils/auth'
import { login, logout, clearToken, getInfo } from '@/utils/keycloak'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  name: '',
  nickName: '', // 昵称
  avatar: '',
  roles: [], // 角色
  account: ''// 账号
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERNICKNAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  }
}

const actions = {
  resetToken({ commit }) {
    clearToken(() => {
      console.log('清除token')
      commit('SET_TOKEN', '')
    })
  },

  // keycloakLogin
  keycloakLogin({ commit }, accessToken) {
    login(accessToken, () => {
      commit('SET_TOKEN', accessToken)
    }).catch(err => {
      console.log('ERROR:', err)
    })
  },

  // get user info from keycloak
  getKeycloakInfo({ commit, state }) {
    getInfo(() => {
      const { idTokenParsed } = Vue.prototype.$keycloak
      const { given_name: name, avatar } = idTokenParsed

      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
    })
  },

  // keycloakLogout
  keycloakLogout({ commit, state }) {
    logout(() => {
      resetRouter()
      commit('SET_TOKEN', '')
      commit('SET_USERID', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
    }).catch(err => {
      console.log('ERROR:', err)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
