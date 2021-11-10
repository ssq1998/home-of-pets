<template>
  <div id="order-history">
    <div v-if="hasOrder">
      <div class="order-history-list" v-for="(item, index) in orderInfo" :key="index">
        <div class="order-history-bar">
          <el-steps
            :active="progress"
            finish-status="success"
            simple
            style="margin-top: 20px"
          >
            <el-step title="确认订单"></el-step>
            <el-step title="付款"></el-step>
            <el-step title="确认收货"></el-step>
          </el-steps>
        </div>
        <div class="order-history-box" v-for="(itemIn, indexIn) in item.goodInfo" :key="indexIn">
          <div class="order-history-info">
            <div class="show-info">
              <p class="img-box">
                 <img v-lazy="itemIn.goodPic[0].path">
              </p>
              <p>{{itemIn.goodName}}</p>
              <p>
                <h3>￥{{itemIn.afterDiscount}}</h3>
                <h3>×{{itemIn.goodNum}}</h3>
              </p>
            </div>
          </div>
        </div>
        <p class="total-price">实付款:<span>￥{{item.totalPrice}}</span></p>
        <ul class="operation-nav">
          <li @click="deleteOrder(index)">删除订单</li>
        </ul>
      </div>
    </div>
    <div class="empty-order" v-else>
      <h2 class="empty-tip">您还没有完成一次购物哦,快去选购心爱的商品吧</h2>
      <div class="to-cart"><router-link to="/petscart"><i class="iconfont icon-che-copy"></i>&nbsp;前往购物车</router-link></div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  data() {
    return {
      progress: 3,
      hasOrder: false,
      orderInfo: []
    }
  },
  async created() {
    const hasDoneOrder = await axios.request({
      url: 'order/showHasDoneOrder',
      method: 'post',
      data: {
        userID: this.$store.state.userInfo.userInfo._id
      }
    })
    if (hasDoneOrder.data[0]) {
      this.hasOrder = true
      this.orderInfo = hasDoneOrder.data
    }
  },
  methods: {
    deleteOrder(index) {
      axios.request({
        url: 'order/deleteOrder',
        method: 'post',
        data: {
          orderID: this.orderInfo[index]._id
        }
      }).then(() => {
        this.orderInfo.splice(index, 1)
        if (this.orderInfo.length === 0) {
          this.hasOrder = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#order-history {
  .order-history-list {
    padding: 0 150px;
    .order-history-bar {}
    .order-history-box {
      .order-history-info {
        .show-info {
          display: flex;
          align-items: center;
          p {
            width: calc(100% / 3);
            text-align: center;
          }
          .img-box {
            width: 150px;
            height: 150px;
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
        }
      }
    }
    .total-price {
      text-align: right;
      font-weight: 700;
      span {
        color: rgb(153, 7, 7);
      }
    }
    .operation-nav {
      display: flex;
      justify-content: flex-end;
      list-style: none;
      margin-top: 10px;
      li {
        width: 100px;
        text-align: center;
        line-height: 30px;
        font-weight: 700;
        cursor: pointer;
        color: #fff;
        background-color: lightcoral;
      }
      li:hover {
        background-color: rgba(lightcoral, 0.7);
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
</style>
