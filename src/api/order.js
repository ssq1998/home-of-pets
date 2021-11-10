import axios from '@/api/axios'

const showOrder = () => {
  return axios.request({
    url: 'order/showOrder',
    method: 'post',
    data: {
      username: this.$store.state.userInfo.userInfo.username
    }
  })
}

export {
  showOrder
}
