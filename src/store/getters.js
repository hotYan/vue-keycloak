const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  nickName: state => state.user.nickName,
  userID: state => state.user.userID,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  tenantId: state => state.user.tenantId,
  permissions: state => state.user.permissions,
  userInfo: state => state.user.userInfo,
}
export default getters
