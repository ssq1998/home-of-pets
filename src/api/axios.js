import axios from 'axios'
import config from '@/config'
import { Message, Loading } from 'element-ui'
import _ from 'lodash'
import router from '../router'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

// 创建loading对象
let loading
// 当前请求的数量
let needLoadingRequestCount = 0

// 关闭loading，设置防抖
const toHideLoading = _.debounce(() => {
  loading.close()
  loading = null
}, 500)

// 显示loading
function showLoading(target) {
  // 这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
  // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
  if (needLoadingRequestCount === 0 && !loading) {
    loading = Loading.service({
      lock: true,
      text: 'Loading...',
      background: 'rgba(255,255,255,0.5)',
      target: target || 'body'
    })
  }
  needLoadingRequestCount++
}

// 隐藏loading
function hideLoading() {
  needLoadingRequestCount--
  // needLoadingRequestCount最小为0
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0)
  if (needLoadingRequestCount === 0) {
    toHideLoading()
  }
}
class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
    // 设置超时时长
    this.timeout = 30000
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      header: {}
    }
    return config
  }

  interceptors(instance, url) {
    // 拦截和处理请求
    instance.interceptors.request.use((config) => {
      // 处理config

      // 判断当前请求是否设置了不显示Loading
      if (config.headers.showLoading !== false) {
        showLoading(config.headers.loadingTarget)
      }

      // 请求头中添加token
      if (localStorage.elementToken) {
        config.headers.Authorization = localStorage.elementToken
      }
      return config
    }, err => {
      // 判断当前请求是否设置了不显示Loading
      if (config.headers.showLoading !== false) {
        hideLoading()
      }
      Message.error('请求超时')
      return Promise.resolve(err)
    })

    // 拦截和处理响应
    instance.interceptors.response.use((res) => {
      // 判断当前请求是否设置了不显示Loading(不显示自然无需隐藏)
      if (res.config.headers.showLoading !== false) {
        hideLoading()
      }
      return res
    }, err => {
      // 请求出错，处理问题
      // 判断当前请求是否设置了不显示Loading(不显示自然无需隐藏)
      if (err.config.headers.showLoading !== false) {
        hideLoading()
      }
      // if (err.response && err.response.data && err.response.data.message) {
      //   const jsonObj = JSON.parse(err.response.data.message)
      //   Message.error(jsonObj.message)
      // } else {
      //   Message.error(err.message)
      // }
      if (err.response.status) {
        if (err.response.status === 401) {
          localStorage.removeItem('elementToken')
          router.push('/login')
          Message.warning('登录信息已失效，请重新登录')
        } else if (err.response.status === 409) {
          Message.warning(err.response.data)
        } else if (err.response.status === 422) {
          Message.warning(err.response.data)
        } else if (err.response.status === 204) {
          Message.warning(err.response.data)
        }
      }
      return Promise.reject(err.response)
      // console.log(err.response)
      // Message.error(err.response.data)
    })
  }

  request(options) {
    // 创建实例对象
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

const axiosObj = new HttpRequest(baseUrl)
export default axiosObj
