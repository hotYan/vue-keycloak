import router from './router/index'
import store from './store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // get token from cookie
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 是否登录
  const authenticated = router.app.$keycloak.authenticated
  // 页面是否需要用户验证
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth)
  // 是否有token
  const hasToken = getToken()
  if ((authenticated && hasToken === undefined) || (authenticated === false && hasToken)) {
    window.location.reload()
  }
  if (authenticated && hasToken) { // 登录，拿用户信息
    if (store.getters.tenantId) { // 通过tenantId是否存在判断是否执行了下面try中的代码
      next()
    } else {
      try {
        await store.dispatch('user/getKeycloakInfo')
        await store.dispatch('user/getUserNickNameById')
        next()
      } catch (error) {
        Message.error(error || 'Has Error')
        next()
        NProgress.done()
      }
    }
  } else { // 没有登录
    if (requiresAuth) { // 如果该页面需要认证
      if (authenticated && hasToken) { // 登录了，直接进入
        await store.dispatch('user/getUserNickNameById')
        next()
      } else { // 没有登录，跳转到登录界面
        const loginUrl = router.app.$keycloak.createLoginUrl()
        window.location.replace(loginUrl)
      }
    } else { // 如果该页面不需要登陆验证，则直接进入
      next()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
