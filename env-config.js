const env = {
  'development': {
    // # keycloak options
    VUE_APP_KEYCLOAK_OPTIONS_URL: 'http://iam.starworlds.cn/auth/',
    VUE_APP_KEYCLOAK_OPTIONS_REALM: 'xcsj',
    VUE_APP_KEYCLOAK_OPTIONS_CLIENTID: 'portal',
    VUE_APP_KEYCLOAK_OPTIONS_ONLOAD: 'check-sso'
  },
  'production': {
    // # keycloak options
    VUE_APP_KEYCLOAK_OPTIONS_URL: 'http://iam.starworlds.cn/auth/',
    VUE_APP_KEYCLOAK_OPTIONS_REALM: 'xcsj',
    VUE_APP_KEYCLOAK_OPTIONS_CLIENTID: 'portal',
    VUE_APP_KEYCLOAK_OPTIONS_ONLOAD: 'check-sso'
  },
  'other': {// # keycloak options
    VUE_APP_KEYCLOAK_OPTIONS_URL: 'http://iam.starworlds.cn/auth/',
    VUE_APP_KEYCLOAK_OPTIONS_REALM: 'xcsj',
    VUE_APP_KEYCLOAK_OPTIONS_CLIENTID: 'portal',
    VUE_APP_KEYCLOAK_OPTIONS_ONLOAD: 'check-sso'
  }
}

// 根据key，获取对应环境变量
function envMode() {
  if (['helm'].includes(process.env.VUE_APP_ENV)) {
    return window
  }
  return env[process.env.VUE_APP_ENV]
}

export default envMode()
