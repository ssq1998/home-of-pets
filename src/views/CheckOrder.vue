<template>
  <div id="check-order">
    <div class="order-content" v-if="hasOrder">
      <div class="select-receiving-address">
        选择收货信息:
        <el-select v-model="value" placeholder="请选择收货信息">
          <el-option
            v-for="(addressItem, index) in addressList"
            :key="index"
            :label="addressItem"
            :value="addressItem"
          >
          </el-option>
        </el-select>
      </div>
      <p class="show-add-btn" v-if="showAdd === false" @click="showAddAddressInfo">新增收货信息</p>
      <div class="add-addressInfo-box" v-if="showAdd">
        <el-input type="text" v-model="text" placeholder='请输入收货地址-联系方式-收货人姓名'></el-input>
        <span @click="addAddressInfo">提交</span>
        <span @click="removeAddAddressInfo">取消</span>
      </div>
      <div class="order-information">
        确认商品信息:
        <div class="order-information-nav">
          <span class="goods-infomation">商品信息</span>
          <span class="unit-price">单价</span>
          <span class="goods-num">数量</span>
          <span class="price">小计</span>
        </div>
        <div
          class="order-infomation-content"
          v-for="(item, index) in goodsInfo"
          :key="index"
        >
          <span class="goods-infomation">
            <img
              v-lazy="item.goodPic[0].path"
              style="width: 100px; height: 100px"
            />
            <span>{{ item.goodName }}</span>
          </span>
          <span class="unit-price">￥{{ item.afterDiscount }}</span>
          <span class="goods-num">{{ item.goodNum }}</span>
          <span class="price">￥{{
            (item.afterDiscount * item.goodNum) | floatPrice
          }}</span>
        </div>
      </div>
      <div class="submit-order">
        <p>实付款:<span>￥{{ orderInfo.totalPrice }}</span></p>
        <p>收货信息:{{ value }}</p>
        <p class="submit-order-btn" @click="submitOrder()">提交订单</p>
      </div>
    </div>
    <div class="empty-order" v-else>
      <h2 class="empty-tip">您还没有新的订单哦</h2>
      <div class="to-cart"><router-link to="/petscart"><i class="iconfont icon-che-copy"></i>&nbsp;前往购物车</router-link></div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  data() {
    return {
      orderInfo: {},
      goodsInfo: [],
      addressList: [],
      value: '',
      hasOrder: false,
      showAdd: false,
      text: ''
    }
  },
  methods: {
    showAddAddressInfo() {
      this.showAdd = true
    },
    removeAddAddressInfo() {
      this.showAdd = false
    },
    async addAddressInfo() {
      if (this.text === '') {
        this.$message({
          type: 'warning',
          message: '请输入收货信息'
        })
      } else {
        const res = await axios.request({
          url: 'receivinginfo/addNewReceivingInfo',
          method: 'post',
          data: {
            userID: this.$store.state.userInfo.userInfo._id,
            receivingInfo: this.text
          }
        })
        this.addressList = res.data.ReceivingInfo
        this.text = ''
        this.$message({
          type: 'success',
          message: '新增收货信息成功'
        })
      }
    },
    async submitOrder() {
      if (this.value !== '') {
        let str = ''
        for (const item of this.goodsInfo) {
          str = str + item.goodName + ': ￥' + item.afterDiscount + 'x' + item.goodNum + ','
        }
        await axios.request({
          url: 'alipay/alipay',
          method: 'post',
          data: {
            outTradeNo: JSON.stringify(this.orderInfo._id),
            totalAmount: this.orderInfo.totalPrice,
            subject: str
          }
        }).then(res => {
          window.location.href = res.data.result
          localStorage.setItem('addressInfo', this.value)
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择收货地址'
        })
      }
    }
  },
  async created() {
    const order = await axios.request({
      url: 'order/showOrder',
      method: 'post',
      data: {
        userID: this.$store.state.userInfo.userInfo._id,
        isChecked: false
      }
    })
    if (order.data[0]) {
      this.hasOrder = true
      this.orderInfo = order.data[0]
      this.goodsInfo = order.data[0].goodInfo
    }
    if (!localStorage.orderID) {
      localStorage.setItem('orderID', JSON.stringify(this.orderInfo._id))
    }
    const receiving = await axios.request({
      url: 'receivinginfo/getReceivingInfo',
      method: 'post',
      data: {
        userID: this.$store.state.userInfo.userInfo._id
      }
    })
    this.addressList = receiving.data.ReceivingInfo
    if (localStorage.orderID) {
      await axios.request({
        url: 'alipay/checkTradeNo',
        method: 'post',
        data: {
          tradeNo: localStorage.orderID
        }
      }).then(async(result) => {
        console.log(result)
        if (result.data.obj.alipay_trade_query_response.code === '10000') {
          await axios.request({
            url: 'order/submitOrder',
            method: 'post',
            data: {
              orderID: JSON.parse(localStorage.orderID),
              receivingInfo: localStorage.addressInfo,
              isChecked: true
            }
          }).then(() => {
            this.$message({
              type: 'success',
              message: '订单提交成功'
            })
            this.$router.push('/inprogress')
          })
          localStorage.removeItem('orderID')
          localStorage.removeItem('addressInfo')
          this.hasOrder = false
        }
      })
    }
  },
  filters: {
    floatPrice(price) {
      return price.toFixed(2)
    }
  },
  async beforeRouteLeave (to, from, next) {
    if (this.hasOrder) {
      this.$confirm('您还有订单未提交,离开后将自动取消订单,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await axios.request({
          url: 'order/deleteOrder',
          method: 'post',
          data: {
            orderID: this.orderInfo._id
          }
        }).then(() => {
          next()
        }).catch(() => {
          next(false)
        })
      })
    } else if (to.path === '/login' && this.hasOrder) {
      await axios.request({
        url: 'order/deleteOrder',
        method: 'post',
        data: {
          orderID: this.orderInfo._id
        }
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      })
    } else {
      next()
    }
  }
}
</script>

<style lang="less" scoped>
#check-order {
  .order-content {
    padding: 0 180px;
    .select-receiving-address {
      margin-top: 30px;
      font-size: 20px;
    }
    .show-add-btn {
      cursor: pointer;
      width: 120px;
      margin-top: 20px;
      text-align: center;
      line-height: 40px;
      background-color: lightcoral;
      color: #fff;
    }
    .add-addressInfo-box {
      margin-top: 20px;
      display: flex;
      span {
        cursor: pointer;
        width: 50px;
        background-color: rgb(67, 185, 224);
        color: #fff;
        text-align: center;
        line-height: 40px;
        margin-left: 10px;
      }
      span:nth-of-type(1) {
        background-color: lightcoral;
      }
    }
    .order-information {
      font-size: 20px;
      margin-top: 30px;
      border-top: 1px solid grey;
      .order-information-nav {
        font-size: 18px;
        margin-top: 30px;
        span {
          height: 30px;
          line-height: 30px;
          display: inline-block;
          text-align: center;
          border-bottom: 3px solid #e68231;
        }
      }
      .order-infomation-content {
        margin-top: 10px;
        display: flex;
        align-items: center;
        font-size: 16px;
        span {
          text-align: center;
        }
        .goods-infomation {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
      }
    }
    .submit-order {
      margin-top: 30px;
      border-top: 1px solid gray;
      font-size: 18px;
      font-weight: 600;
      p:nth-of-type(1) span {
        color: rgb(165, 9, 9);
      }
      .submit-order-btn {
        margin-top: 10px;
        width: 120px;
        line-height: 40px;
        text-align: center;
        background-color: #f56c6c;
        color: #fff;
        cursor: pointer;
      }
    }
  }
  .empty-order {
    margin-top: 30px;
    position: relative;
    width: 100%;
    height: 400px;
    background: url(../assets/static/emptyorder.png);
    background-repeat: no-repeat;
    background-position: center;
    .empty-tip {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
    }
    .to-cart {
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      width: 200px;
      padding: 3px 10px;
      border: 1px solid lightcoral;
      border-radius: 5px;
      a {
        font-size: 20px;
        color: lightcoral;
      }
    }
  }
}

.goods-infomation {
  width: 600px;
}
.unit-price {
  width: 200px;
}
.goods-num {
  width: 100px;
}
.price {
  width: 200px;
}
</style>
