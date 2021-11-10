import axios from '@/api/axios'

const getLoginUserInfo = () => {
  return axios.request({
    url: 'user/getLoginUserInfo',
    methods: 'get'
  })
}

export {
  getLoginUserInfo
}
