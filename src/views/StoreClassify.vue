<template>
  <div id="store-classify">
    <div class="search-box">
      <input type="text" v-model="searchText" @keyup.enter="searchSubmit" />
      <i class="iconfont icon-xingtaiduICON_sousuo---copy" @click="searchSubmit"></i>
    </div>
    <h2 class="search-num">共搜索到{{len}}个商品</h2>
    <div class="show-store-content" v-if="len">
      <div class="show-list">
        <ul
          class="show-list-content"
          v-for="(item, index) in goodsList"
          :key="index"
        >
          <img v-lazy="item.goodPic[0].path">
          <p class="goods-name">{{ item.goodName }}</p>
          <p class="goods-price">￥{{ item.afterDiscount }}</p>
          <div class="add-cart-btn" @click="addToCart(index)">加入购物车</div>
        </ul>
      </div>
    </div>
    <div class="empty-store" v-else></div>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  data() {
    return {
      goodsList: [],
      searchText: ''
    }
  },
  async created() {
    console.log(this.$route.params)
    const classification = this.$route.params.classification
    let result
    if (classification === 'clothes' || classification === 'food' || classification === 'living' || classification === 'travel') {
      result = await axios.request({
        url: '/good/getGoods',
        method: 'post',
        data: {
          classification: classification
        }
      })
    } else if (classification === 'search') {
      result = await axios.request({
        url: '/good/searchGoods',
        method: 'post',
        data: {
          text: this.$route.params.searchText
        }
      })
    } else {
      result = await axios.request({
        url: '/good/getGoods',
        method: 'post'
      })
    }
    console.log(result)
    this.goodsList = result.data
  },
  methods: {
    async searchSubmit() {
      console.log(this.searchText)
      const res = await axios.request({
        url: '/good/searchGoods',
        method: 'post',
        data: {
          text: this.searchText
        }
      })
      this.goodsList = res.data
    }
  },
  computed: {
    len() {
      if (this.goodsList.length) {
        return this.goodsList.length
      }
      return 0
    }
  }
}
</script>

<style lang="less" scoped>
#store-classify {
  padding: 60px 100px 0px;
  .search-box {
    height: 35px;
    margin-top: 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      width: 160px;
      position: absolute;
      right: 0;
      outline: none;
      padding: 5px 30px 5px 10px;
      border: 3px solid #CC9756;
      border-radius: 20px;
      overflow: hidden;
      background-color: inherit;
      transition: 0.5s;
    }
    input:focus {
      width: 280px;
    }
    i {
      position: absolute;
      right: 10px;
      color: #CC9756;
      cursor: pointer;
    }
  }
  .search-num {
    color: #333;
  }
  .show-store-content {
    margin-top: 10px;
    background-color: #fff;
    .show-list {
      padding: 10px 5px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-wrap: wrap;
      .show-list-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 200px;
        height: 320px;
        img {
          width: 100%;
          height: 220px;
        }
        p {
          text-align: center;
          font-size: 14px;
          font-weight: 700;
        }
        .goods-name {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .goods-price {
          color: #df1f1f;
        }
        .add-cart-btn{
          margin-top: 10px;
          border: 1px solid #CC9756;
          width: 100px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 5px;
          color: #fff;
          background-color: #CC9756;
          cursor: pointer;
        }
      }
      .show-list-content:hover {
        box-shadow: 1px 1px 5px #999;
      }
    }
  }
  .empty-store {
    height: 450px;
    background: url('../assets/static/nogoods.png');
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
