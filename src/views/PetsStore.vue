<template>
  <div id="pets-store">
    <div class="walking-lantern">
      <el-carousel height="500px">
        <el-carousel-item v-for="(item, index) in lanternList" :key="index">
          <router-link :to="{ name: 'StoreClassify', params: { classification: item.classification }}">
            <img v-lazy="item.pic" />
          </router-link>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="search-box">
      <input type="text" v-model="searchText" @keyup.enter="searchSubmit" placeholder="搜索商品" />
      <i class="iconfont icon-xingtaiduICON_sousuo---copy" @click="searchSubmit"></i>
    </div>
    <div class="show-store">
      <div class="show-store-title">
        <h1>人气推荐<span>为您推荐世间好物</span></h1>
        <div class="check-more">
          <router-link :to="{ name: 'StoreClassify', params: { classification: 'all' }}">全部商品
          <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
      </div>
      <div class="show-store-content">
        <div class="show-list">
          <ul
            class="show-list-content"
            v-for="(item, index) in goods"
            :key="index"
          >
            <img v-lazy="item.goodPic[0].path">
            <p class="goods-name">{{ item.goodName }}</p>
            <p class="goods-price">￥{{ item.afterDiscount }}</p>
            <div class="add-cart-btn" @click="addToCart(index)">加入购物车</div>
          </ul>
        </div>
      </div>
      <div class="store-classify" v-for="(store, index) in storeInfo" :key="index">
        <div class="title">
          <router-link :to="{ name: 'StoreClassify', params: { classification: store.classification }}">
              <h1>{{store.title}}</h1>
          </router-link>
            <router-link :to="{ name: 'StoreClassify', params: { classification: store.classification }}">
              <p class="check-more">查看更多<i class="el-icon-arrow-right"></i></p>
            </router-link>
        </div>
        <div class="img-box">
          <router-link :to="{ name: 'StoreClassify', params: { classification: store.classification }}">
            <img v-lazy="store.src" />
          </router-link>
        </div>
        <div class="content">
            <ul class="production" v-for="(item, indexIn) in store.goods" :key="indexIn">
                <img v-lazy="item.goodPic[0].path" />
                <p class="goods-name">{{ item.goodName }}</p>
                <p class="goods-price">￥{{ item.afterDiscount }}</p>
                <div class="add-cart-btn" @click="addCart(index,indexIn)">加入购物车</div>
            </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHotsaleGoods, getGoodsOfClothes, getGoodsOfFood, getGoodsOfLiving, getGoodsOfTravel } from '@/api/goods'
import axios from '@/api/axios'

export default {
  data() {
    return {
      lanternList: [{
        pic: require('../assets/bgimage/06b39764df3c4d4b94abdea192b36e90.jpeg'),
        classification: 'food'
      },{
        pic: require('../assets/bgimage/efb30f157639400bb096d578463429ab.jpeg'),
        classification: 'clothes'
      },{
        pic: require('../assets/bgimage/a842d17b9ac043d0b1e3f57a2ca686a8_th.jpg'),
        classification: 'travel'
      },{
        pic: require('../assets/bgimage/4a2a52ebf6c94a1f931330efcae04147.jpeg'),
        classification: 'living'
      }],
      searchText: '',
      input: '',
      goods: [],
      storeInfo: [
        {
          title: '服饰装扮',
          classification: 'clothes',
          goods: [],
          src: require('../assets/bgimage/ab76ff6f21714dbd8ba5e868367082b8.jpeg')
        },
        {
          title: '营养食品',
          classification: 'food',
          goods: [],
          src: require('../assets/bgimage/a61e4a7549df4c9a8c41b042edc89dda.jpeg')
        },
        {
          title: '爱心家居',
          classification: 'living',
          goods: [],
          src: require('../assets/bgimage/sacbkaj23as5c.jpg')
        },
        {
          title: '呵护出行',
          classification: 'travel',
          goods: [],
          src: require('../assets/bgimage/89cc33f0396f422f9d9e38dc9fc16b17.jpeg')
        }
      ]
    }
  },
  async created() {
    const result = await getHotsaleGoods()
    this.goods = result.data

    const goodsOfClothes = await getGoodsOfClothes()
    this.storeInfo[0].goods = goodsOfClothes.data

    const goodsOfFood = await getGoodsOfFood()
    this.storeInfo[1].goods = goodsOfFood.data

    const goodsOfLiving = await getGoodsOfLiving()
    this.storeInfo[2].goods = goodsOfLiving.data

    const goodsOfTravel = await getGoodsOfTravel()
    this.storeInfo[3].goods = goodsOfTravel.data
  },
  methods: {
    async addToCart(index) {
      await axios.request({
        url: 'cart/addToCart',
        method: 'post',
        data: {
          goodID: this.goods[index]._id,
          userID: this.$store.state.userInfo.userInfo._id
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '加入购物车成功'
        })
      })
    },
    searchSubmit() {
      this.$router.push({ name: 'StoreClassify', params: { classification: 'search', searchText: this.searchText }})
    },
    async addCart(index,indexIn) {
      await axios.request({
        url: 'cart/addToCart',
        method: 'post',
        data: {
          goodID: this.storeInfo[index].goods[indexIn]._id,
          userID: this.$store.state.userInfo.userInfo._id
        }
      }).then(res => {
        this.$message({
          type: 'success',
          message: '加入购物车成功'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
#pets-store{
  .walking-lantern {
    .el-carousel__item:nth-child(2n) {
        background-color: #CC9756;
    }
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
    .el-carousel__item {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .search-box {
    height: 50px;
    background-color: #fff;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      width: 160px;
      position: absolute;
      right: 100px;
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
      right: 110px;
      color: #CC9756;
      cursor: pointer;
    }
  }
  .show-store {
    width: 100%;
    background-color: #fff;
    padding: 20px 100px 0;
    .show-store-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h1 {
        color: #333;
        span {
          font-size: 16px;
          margin-left: 15px;
        }
      }
      .check-more {
        color: #333;
        cursor: pointer;
        transition: 0.2s;
      }
      .check-more:hover {
        color: #CC9756;
      }
    }
    .show-store-content {
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
    .store-classify {
      margin-top: 30px;
      .title {
        display: flex;
        justify-content: space-between;
        h1 {
          color: #333;
          transition: 0.2s;
        }
        .check-more {
          color: #333;
          cursor: pointer;
          transition: 0.2s;
        }
        .check-more:hover, h1:hover {
          color: #cc9756;
        }
      }
      .img-box {
        margin-top: 20px;
        width: 100%;
        height: 350px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .content {
        padding: 10px 5px;
        background-color: rgb(232, 240, 241);
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        border-radius: 5px;
        .production {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 200px;
          height: 320px;
          img {
            width: 100%;
            height: 220px;
            object-fit: contain;
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
          .add-cart-btn {
            margin-top: 10px;
            border: 1px solid #cc9756;
            width: 100px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border-radius: 5px;
            color: #fff;
            background-color: #cc9756;
            cursor: pointer;
          }
        }
        .production:hover {
          box-shadow: 1px 1px 5px #999;
        }
      }
    }
  }
}
</style>
