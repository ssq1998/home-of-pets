<template>
    <div id="pets-cart">
        <div class="cart-container">
          <div class="product-box" v-if="proList.length">
            <div class="product-title">
              <input type="checkbox" v-model="isAllChecked" />
              <span>全选</span>
              <p>
                <span class="product-info-title">商品信息</span>
                <span class="unit-price">单价</span>
                <span class="product-num">数量</span>
                <span class="price">小计</span>
                <span class="operation">操作</span>
              </p>
            </div>
            <div class="pro-item" v-for="(pro, index) in proList" :key="index">
              <div class="pro-input">
                <input type="checkbox" v-model="pro.isChecked" />
              </div>
              <div class="pro-info">
                <img v-lazy="pro.goodPic[0].path" class="pro-image">
                <div class="pro-title">
                  <p class="pro-name">{{ pro.goodName }}</p>
                </div>
              </div>
              <div class="pro-price">
                <span class="cut-after-price">￥{{ pro.afterDiscount }}</span>
                <span class="cut-before-price">￥{{ pro.beforeDiscount }}</span>
              </div>
              <el-input-number size="small" v-model="pro.goodNum" :min="1"></el-input-number>
              <div class="pro-price-sum">￥{{ pro.afterDiscount*pro.goodNum | floatPrice}}</div>
              <div class="del-btn" @click="confirmRemove(index)">删除</div>
            </div>
            <div class="account-content">
              <span class="account-num">已选&nbsp;{{accountNum}}&nbsp;件</span>
              <div class="account-table">
                <p class="account-operation" @click="deleteAll()">批量删除</p>
                <div class="account-total">
                  <ul class="account-list">
                    <li>商品合计:￥{{totalBeforeDiscountPrice | floatPrice}}</li>
                    <li>已优惠:￥{{totalAfterDiscountPrice | floatPrice}}</li>
                  </ul>
                  <p class="account-pay">应付金额:
                    <span>￥{{totalPrice | floatPrice}}</span>
                  </p>
                </div>
                <div class="account-btn" @click="addToOrder()">下单</div>
              </div>
            </div>
          </div>
          <div class="empty-cart" v-else>
            <p>购物车还是空的哦<router-link to="/petsstore">去购物</router-link></span></p>
          </div>
        </div>
    </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  data() {
    return {
      proList: []
    }
  },
  async created() {
    const res = await axios.request({
      url: 'cart/showCart',
      method: 'post',
      data: {
        userID: this.userID
      }
    })
    this.proList = res.data
  },
  filters: {
    floatPrice(price) {
      return price.toFixed(2)
    }
  },
  methods: {
    async addToOrder() {
      const good = this.proList.filter((item) => item.isChecked === true)
      if (!good.length) {
        return this.$message({
          type: 'warning',
          message: '请勾选商品后再下单'
        })
      }
      await axios.request({
        url: 'order/createOrder',
        method: 'post',
        data: {
          userID: this.$store.state.userInfo.userInfo._id,
          totalPrice: this.totalPrice,
          goodInfo: [...good]
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: '下单成功'
        })
        this.$router.push('/checkorder')
      })
    },
    confirmRemove(index) {
      this.$confirm('是否将该商品移出购物车?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const newList = []
        newList.push(this.proList[index]._id)
        const res = await axios.request({
          url: 'cart/deleteSelectedGood',
          method: 'post',
          data: {
            userID: this.$store.state.userInfo.userInfo._id,
            proList: newList
          }
        })
        this.proList = res.data
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteAll: function() {
      this.$confirm('是否将选中商品移出购物车?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const newList = []
        const len = this.proList.length
        for (let i = 0; i < len; i++) {
          if (this.proList[i].isChecked === true) {
            newList.push(this.proList[i]._id)
          }
        }
        const res = await axios.request({
          url: 'cart/deleteSelectedGood',
          method: 'post',
          data: {
            userID: this.$store.state.userInfo.userInfo._id,
            proList: newList
          }
        })
        this.proList = res.data
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  computed: {
    userID() {
      return this.$store.state.userInfo.userInfo._id
    },
    totalBeforeDiscountPrice: function() {
      let res = 0
      const len = this.proList.length
      for (let i = 0; i < len; i++) {
        if (this.proList[i].isChecked === true) {
          res += this.proList[i].beforeDiscount * this.proList[i].goodNum
        } else {
          res += 0
        }
      }
      return res
    },
    totalAfterDiscountPrice: function() {
      let res = 0
      const len = this.proList.length
      for (let i = 0; i < len; i++) {
        if (this.proList[i].isChecked === true) {
          res += (this.proList[i].beforeDiscount - this.proList[i].afterDiscount) * this.proList[i].goodNum
        } else {
          res += 0
        }
      }
      return res
    },
    totalPrice: function() {
      return this.totalBeforeDiscountPrice - this.totalAfterDiscountPrice
    },
    accountNum: function() {
      let res = 0
      const len = this.proList.length
      for (let i = 0; i < len; i++) {
        if (this.proList[i].isChecked === true) {
          res += parseInt(this.proList[i].goodNum)
        } else {
          res += 0
        }
      }
      return res
    },
    isAllChecked: {
      get: function() {
        return this.proList.every(function(item) {
          return item.isChecked === true
        })
      },
      set: function(val) {
        this.proList.forEach(function(item, index, arr) {
          arr[index].isChecked = val
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
#pets-cart {
  .cart-container {
    padding: 60px 180px 0;
    .product-box {
      .product-title {
        border: 1px solid #a5adbb;
        background-color: rgb(223, 221, 221);
        display: flex;
        align-items: center;
        height: 50px;
        input {
          width: 20px;
          height: 20px;
        }
        p {
          display: flex;
          span:nth-of-type(1) {
            margin-left: 80px;
          }
          span:nth-of-type(2) {
            margin-left: 320px;
          }
          span:nth-of-type(3) {
            margin-left: 170px;
          }
          span:nth-of-type(4) {
            margin-left: 150px;
          }
          span:nth-of-type(5) {
            margin-left: 130px;
          }
        }
      }
      .pro-item {
        border: 1px solid  rgb(187, 184, 184);
        background-color: #faebe0;
        display: flex;
        height: 150px;
        align-items: center;
        margin: 10px 0;
        .pro-input {
          margin-left: 30px;
          input {
            width: 20px;
            height: 20px;
          }
        }
        .pro-info {
          margin-left: 90px;
          width: 330px;
          display: flex;
          align-items: center;
          .pro-image {
            width: 100px;
            height: 100px;
            background-color: #fff;
          }
          .pro-title {
            margin-left: 10px;
          }
        }
        .pro-price {
          width: 180px;
          .cut-before-price {
            color: #999;
            text-decoration: line-through;
          }
          .cut-after-price {
            font-size: 20px;
          }
        }
        .el-input-number {
          margin-left: 20px;
        }
        .pro-price-sum {
          margin-left: 35px;
          width: 150px;
          color: #d4282d;
          text-align: center;
        }
        .del-btn {
          margin-left: 60px;
          width: 60px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          color: #333;
          border-radius: 4px;
          background-color: #CC9756;
          cursor: pointer;
        }
      }
      .account-content {
        border: 1px solid #a5adbb;
        display: flex;
        align-items: center;
        height: 60px;
        background-color: rgb(223, 221, 221);
        .account-table {
          display: flex;
          align-items: center;
          .account-operation {
            margin-left: 30px;
            cursor: pointer;
          }
          .account-operation:hover {
            color: orangered;
          }
          .account-total {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 400px;
            margin-left: 200px;
            .account-list {
              list-style: none;
              color: rgb(82, 77, 77);
            }
            .account-pay {
              span {
                font-size: 22px;
                color: #77171a;
                font-weight: 700;
              }
            }
          }
          .account-btn {
            margin-left: 280px;
            height: 50px;
            width: 100px;
            text-align: center;
            line-height: 50px;
            font-size: 18px;
            color: #fff;
            background-color:#E36844;
            border-radius: 5px;
            cursor: pointer;
          }
        }
      }
    }
    .empty-cart {
      position: relative;
      width: 100%;
      height: 500px;
      background: url('../assets/static/emptycart.png');
      background-repeat: no-repeat;
      background-position: center;
      p {
        color: gray;
        font-size: 20px;
        position: absolute;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        a {
          margin-left: 10px;
          font-size: 16px;
          color: #CC9756;
        }
      }
    }
  }
}
</style>
