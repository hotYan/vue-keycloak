# vue-keycloak
在 vue2 中集成keycloak。使用 keycloak-js ，实现单点登录功能，对用户的登录登出，身份认证进行统一的管理。


## Use
### 1.Installation
基于 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 项目，在现有依赖上新增 [keycloak-js](https://www.npmjs.com/package/keycloak-js)。
```shell
$ yarn add keycloak-js
# OR
$ npm install keycloak-js
```

### 2. 封装 keycloak 初始化（utils）
在 utils 目录下新增 keycloak.js  或 keycloakInstall.js  文件。


### 3. 修改 main.js
在入口文件 main.js 中初始化 keycloak ：
```js
import { initKeycloak } from '@/utils/keycloak'
initKeycloak({ url, realm, clientId, onLoad }, vueInstance)// 封装成方法，直接调用

// import  initKeycloak  from '@/utils/keycloayInstall'
// Vue.use(initKeycloak, { url, realm, clientId, onLoad }, vueInstance) // 封装成插件，通过Vue.use 注册使用
```

### 4. 将用户信息存到 vuex （store）
在 store 目录下新建 /modules/user.js  ，进行用户信息全局管理。

### 5. 修改 permission.js
在 permission.js 文件中，进行登录验证，并通过 keycloak 拿用户数据。
