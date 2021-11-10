<template>
  <div id="wait-order">
    <div class="order-title">
        <p>等待发货</p>
    </div>
    <div class="follow-nav" v-if="list.length">
        <div class="follow-item" v-for="(item,index) in list" :key="index">
            <div class="item-userInfo">
                <img v-lazy="item.userPhoto">
                <div class="follow-username">{{item.username}}</div>
            </div>
            <div class="item-operation">
                <div class="follow-operation" @click="deleteAttentionUser(index)">取消关注</div>
            </div>
        </div>
    </div>
    <div class="empty-list" v-else>
        <h3>你还没有待发货的商品哦</h3>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  data() {
    return {
      list: [],
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
    const res = await axios.request({
      url: 'order/getWaitGoods',
      method: 'post',
      data: {
        storeID: this.storeInfo._id
      }
    })
    console.log(res)
  }
}
</script>

<style lang="less" scoped>
#wait-order {
    background-color: rgba(#fff, 0.3);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    width: 750px;
    .order-title {
        padding: 10px 25px;
        border-bottom: 1px solid #c2bebe;
    }
    .empty-list {
        position: relative;
        width: 100%;
        height: 300px;
        background: url('../assets/static/nocontent.png');
        background-repeat: no-repeat;
        background-position: center;
        h3 {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-weight: 500;
        }
    }
}
</style>
