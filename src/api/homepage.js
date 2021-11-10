import axios from '@/api/axios'

const getHomepageGoods = () => {
  return axios.request({
    url: 'homepage/getHomepageGoods',
    method: 'post'
  })
}

export { getHomepageGoods }
