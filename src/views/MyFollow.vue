<template>
    <div id="my-follow">
        <div class="follow-header-title">
            <p>我的关注</p>
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
            <h3>你还没有关注过任何人哦</h3>
        </div>
    </div>
</template>

<script>
import axios from '@/api/axios'
import { getLoginUserInfo } from '@/api/user'

export default {
  data() {
    return {
      list: []
    }
  },
  async created() {
    const res = await axios.request({
      url: 'user/getAttentionUsers',
      method: 'post',
      data: {
        attentionList: this.$store.state.userInfo.userInfo.myAttentionList
      }
    })
    this.list = res.data
  },
  methods: {
    async deleteAttentionUser(index) {
      const res = await axios.request({
        url: 'user/deleteAttentionUser',
        method: 'post',
        data: {
          _id: this.$store.state.userInfo.userInfo._id,
          attentionUserID: this.list[index]._id
        }
      })
      this.list = res.data
      await getLoginUserInfo().then(async(result) => {
        this.$store.dispatch('userInfo/setUserInfo', result.data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
#my-follow {
    background-color: rgba(#fff, 0.3);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    width: 750px;
    .follow-header-title {
        padding: 10px 25px;
        border-bottom: 1px solid #c2bebe;
    }
    .follow-nav {
        display: flex;
        justify-content: left;
        padding: 10px 25px;
        .follow-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 80px;
            .item-userInfo {
                display: flex;
                align-items: center;
              img {
                border-radius: 50%;
                width: 70px;
                height: 70px;
              }
              .follow-username {
                  font-weight: 500;
                  font-size: 16px;
                  margin-left: 25px;
              }
            }
            .item-operation {
                .follow-operation {
                    padding: 5px 10px;
                    background-color: lightcoral;
                    font-size: 16px;
                    color: #fff;
                    cursor: pointer;
                }
                .follow-operation:hover {
                    background-color: rgba(lightcoral,0.7);
                }
            }
        }
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
