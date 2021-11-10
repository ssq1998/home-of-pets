import axios from '@/api/axios'

const getHotsaleGoods = () => {
  return axios.request({
    url: 'good/getHotsaleGoods',
    method: 'get'
  })
}

const getGoodsOfClothes = () => {
  return axios.request({
    url: 'good/getGoodsOfClothes',
    method: 'get'
  })
}

const getGoodsOfFood = () => {
  return axios.request({
    url: 'good/getGoodsOfFood',
    method: 'get'
  })
}

const getGoodsOfLiving = () => {
  return axios.request({
    url: 'good/getGoodsOfLiving',
    method: 'get'
  })
}

const getGoodsOfTravel = () => {
  return axios.request({
    url: 'good/getGoodsOfTravel',
    method: 'get'
  })
}

export { getHotsaleGoods, getGoodsOfClothes, getGoodsOfFood, getGoodsOfLiving, getGoodsOfTravel }
