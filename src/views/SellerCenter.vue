<template>
  <div id="seller-center">
    <div class="header-container">
      <p>卖家中心</p>
      <p>店铺名:{{storeInfo.storeName}}</p>
      <router-link :to="{ name: 'GoodDetail', params: { good: {} }}">点击上架商品</router-link>
    </div>
    <div class="goods-container" v-if="goodList.length">
        <div class="goods-list" v-for="(item, index) in goodList" :key="index">
            <div class="goods-item">
                <div class="img-box">
                    <img v-lazy="item.goodPic[0].path" />
                </div>
                <div class="goodInfo-box">
                    <p class="goods-name">商品名:{{item.goodName}}</p>
                    <p class="goods-price">商品价格:{{item.beforeDiscount | floatPrice}}/{{item.afterDiscount | floatPrice}}</p>
                    <p>商品分类:{{item.classification}}</p>
                    <p>上架时间:{{item.putDate | fixedDate}}</p>
                </div>
                <div class="operation-box">
                    <router-link :to="{ name: 'GoodDetail', params: { good: item }}">修改商品信息</router-link>
                    <p @click="deleteGood(index)">删除商品</p>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="empty-list">
        <p class="empty-tip">你还没有上架任何商品</p>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
import moment from 'moment'

export default {
  data() {
    return {
      goodList: [],
      storeInfo: {}
    }
  },
  async created() {
    const store = await axios.request({
      url: 'store/getStoreInfo',
      method: 'post',
      data: {
        userID: this.$store.state.userInfo.userInfo._id
      }
    })
    this.storeInfo = store.data[0]
    const goods = await axios.request({
      url: 'good/getGoodsAutho',
      method: 'post',
      data: {
        storeID: this.storeInfo._id
      }
    })
    this.goodList = goods.data
  },
  filters: {
    floatPrice(price) {
      return price.toFixed(2)
    },
    fixedDate(date) {
      moment.locale('zh-cn')
      return moment(date).format('lll')
    }
  },
  methods: {
    async deleteGood(index) {
      const res = await axios.request({
        url: 'good/deleteGood',
        method: 'post',
        data: {
          storeID: this.storeInfo._id,
          _id: this.goodList[index]._id
        }
      })
      this.goodList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
#seller-center {
  background-color: rgba(#fff, 0.5);
  border-radius: 4px;
  width: 750px;
  .header-container {
    padding: 10px 25px;
    border-bottom: 1px solid #c2bebe;
    display: flex;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
    a {
        display: inline-block;
        font-size: 18px;
        color: lightcoral;
    }
  }
  .goods-container {
      .goods-list {
          .goods-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #c2bebe;
              .img-box {
                  width: 150px;
                  height: 150px;
                  background-color: #fff;
                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  }
              }
              .goodInfo-box {
                width: 60%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                .goods-name {
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              .operation-box {
                width: 120px;
                display: flex;
                flex-direction: column;
                align-items: center;
                a {
                  transition: 0.2s;
                }
                p {
                  margin-top: 5px;
                  cursor: pointer;
                  transition: 0.2s;
                }
                a:hover, p:hover {
                  color: lightcoral;
                }
              }
          }
      }
  }
  .empty-list {
    position: relative;
    width: 100%;
    height: 320px;
    background: url(../assets/static/emptyorder.png);
    background-repeat: no-repeat;
    background-position: center;
    .empty-tip {
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        width: 200px;
        padding: 3px 10px;
        border-radius: 5px;
        color: gray;
        font-size: 18px;
        font-weight: 700;
    }
  }
}
</style>
