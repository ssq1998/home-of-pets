export default {
  namespaced: true,
  state: {
    storeInfo: {}
  },
  getters: {
    storeInfo: state => state.storeInfo
  },
  mutations: {
    setStoreInfo(state, value) {
      state.storeInfo = value
    }
  },
  actions: {
    setStoreInfo(content, storeInfo) {
      content.commit('setStoreInfo', storeInfo)
    }
  }
}
