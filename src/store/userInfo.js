export default {
  namespaced: true,
  state: {
    userInfo: {},
    isLogin: false
  },
  getters: {
    userInfo: state => state.userInfo,
    isLogin: state => state.isLogin
  },
  mutations: {
    setUserInfo(state, value) {
      state.userInfo = value
    },
    setIsLogin(state, value) {
      state.isLogin = value
    }
  },
  actions: {
    setUserInfo(content, userInfo) {
      content.commit('setUserInfo', userInfo)
    },
    setIsLogin(content, isLogin) {
      content.commit('setIsLogin', isLogin)
    }
  }
}
