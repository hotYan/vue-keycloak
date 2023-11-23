import { getToken, setToken, removeToken } from '@/utils/auth'
// import { getPermissionPathList } from '@/utils'
import router, { resetRouter } from '@/router'
import Vue from 'vue'
const state = {
  token: getToken(),
  name: '',
  userID: '',
  nickName: '', // 昵称å
  avatar: '',
  introduction: '',
  tenantId: '',
  roles: [], // 角色
  permissions: [],
  account: '', // 账号
  parentId: ''// 0：子账号
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, id) => {
    state.userID = id
  },
  SET_USERNICKNAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_TENANTID: (state, tenantId) => {
    state.tenantId = tenantId
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_PARENTID: (state, id) => {
    state.parentId = id
  },
  SET_USERTYPE: (state, type) => {
    state.userType = type
  }
}

const actions = {
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      console.log('清除token')
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // keycloakLogin
  keycloakLogin({ commit }, accessToken) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', accessToken)
      setToken(accessToken)
      resolve()
    })
  },

  // get user info from keycloak
  getKeycloakInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (!Vue.prototype.$keycloak) {
        reject('keycloak not init')
      }

      if (!Vue.prototype.$keycloak.authenticated) {
        reject('Verification failed, please Login again.')
      }

      const roles = Vue.prototype.$keycloak.realmAccess.roles
      // const name = Vue.prototype.$keycloak.idTokenParsed.preferred_username
      const name = Vue.prototype.$keycloak.idTokenParsed.given_name
      const avatar = Vue.prototype.$keycloak.idTokenParsed.avatar
      const introduction = Vue.prototype.$keycloak.idTokenParsed.introduction
      const userID = Vue.prototype.$keycloak.idTokenParsed.sub
      const tenantId = Vue.prototype.$keycloak.idTokenParsed.tenant_id
      // console.log('Vue.prototype.$keycloak', Vue.prototype.$keycloak)
      // roles must be a non-empty array
      if (!roles || roles.length <= 0) {
        reject('getKeycloakInfo: roles must be a non-null array!')
      }

      // you can also use the method loadUserProfile() to get user attributes
      // Vue.prototype.$keycloak.loadUserProfile().then(profile => {
      //   let avatar = profile.attributes.avatar[0]
      //   let introduction = profile.attributes.introduction[0]
      // })

      const data = {
        roles,
        name,
        avatar,
        userID,
        introduction
      }
      // console.log('userInfo', data)
      commit('SET_ROLES', roles)
      commit('SET_USERID', userID)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      commit('SET_TENANTID', tenantId)
      resolve(data)
    })
  },

  // keycloakLogout
  keycloakLogout({ commit, state }) {
    // console.log('退出1')
    return new Promise((resolve, reject) => {
      // console.log('退出2')
      Vue.prototype.$keycloak.logout().then(() => {
        removeToken()
        resetRouter()
        // console.log('退出3')
        commit('SET_TOKEN', '')
        commit('SET_USERID', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUserNickNameById({ commit, state }) {
    return new Promise((resolve, reject) => {
      Vue.prototype.axios({
        method: 'get',
        url: Vue.prototype.$ENV.VUE_APP_SUBACCOUNT_API + '/sub/user/getUserById',
        params: { id: state.userID },
        headers: {
          'Authorization': 'Bearer ' + getToken(),
          'x-req-flag': '1',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }

      }).then(res => {
        if (res.data.code === 0) {
          const { nickName, account, parentId, type } = res.data.data
          commit('SET_USERNICKNAME', nickName)
          commit('SET_ACCOUNT', account)
          commit('SET_PARENTID', parentId)
          commit('SET_USERTYPE', type) // type1运营 2用户
        } else {
          console.error('ERR:', res.data.message)
          // reject()
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
