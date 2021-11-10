import Vue from 'vue'
import Vuex from 'vuex'
import userInfo from './userInfo'
import storeInfo from './storeInfo'

Vue.use(Vuex)

// 创建整个项目的数据仓库对象，将多组件公用的数据放置到此对象中
const store = new Vuex.Store({
  // 相当于data
  state: {},

  // 计算属性
  getters: {},

  // 相当于methods
  mutations: {},

  // 放置异步方法
  actions: {},

  // 模块
  modules: {
    userInfo,
    storeInfo
  }
})

export default store
