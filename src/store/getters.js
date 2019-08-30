const getters = {
  userName: state => state.auth.userName,
  userCode: state => state.auth.userCode,
  userId: state => state.auth.userId,
  permissions: state => state.auth.permissions,
  asyncRoutes: state => state.auth.asyncRoutes,

  multiTab: state => state.app.multiTab
}

export default getters
