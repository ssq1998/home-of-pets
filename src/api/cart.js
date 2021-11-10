import axios from '@/api/axios'

const showCart = () => {
  return axios.request({
    url: 'cart/showCart',
    method: 'post',
    data: {
      username: this.$store.state.userInfo.userInfo.username
    }
  })
}

export {
  showCart
}
