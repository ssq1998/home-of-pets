<template>
  <div id="admini-interface">
    <h1>管理员界面</h1>
    <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="普通用户 OrdinaryUsers" name="1">
          <div class="user-list" v-for="(item, index) in userList" :key="index">
              <div class="user-item">
                  <p>用户名:{{item.username}}</p>
                  <p>手机号码:{{item.phoneNumber}}</p>
                  <p>注册时间:{{item.createDate | fixDate}}</p>
                  <span @click="checkArticle(index)">查看用户文章</span>
              </div>
          </div>
          <div class="user-article-box" v-if="userArticleList.length">
            <div class="user-article-list" v-for="(item, index) in userArticleList" :key="index">
              <div class="user-article-item">
                <p>发布者:{{item.username}}</p>
                <p v-if="item.aid === '1'">分区:宠物之家</p>
                <p v-else-if="item.aid === '2'">分区:宠物社区</p>
                <p v-else>分区:宠物百科</p>
                <p>标题:{{item.title}}</p>
                <p v-if="item.uploadImg.length" class="img-box">
                  <img v-lazy="item.uploadImg[0].path" />
                </p>
                <p v-if="item.uploadVideo.length" class="video-box">
                  <video :src="item.uploadVideo[0]"></video>
                </p>
                <p>发布时间:{{item.publishDate | fixDate}}</p>
                <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">查看详情</router-link>
                <span @click="deleteArticle(index)">删除</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-box">
            <h2>空文章列表</h2>
          </div>
        </el-collapse-item>
        <el-collapse-item title="卖家用户 SellerUsers" name="2">
          <div class="seller-list" v-for="(item, index) in sellerList" :key="index">
              <div class="seller-item">
                  <p>用户名:{{item.username}}</p>
                  <p>手机号码:{{item.phoneNumber}}</p>
                  <p>注册时间:{{item.createDate | fixDate}}</p>
                  <span @click="checkSellerArticle(index)">查看用户文章</span>
                  <span @click="checkGood(index)">查看卖家商品</span>
              </div>
          </div>
          <div class="user-article-box" v-if="sellerArticleList.length">
            <div class="user-article-list" v-for="(item, index) in sellerArticleList" :key="index">
              <div class="user-article-item">
                <p>发布者:{{item.username}}</p>
                <p v-if="item.aid === '1'">分区:宠物之家</p>
                <p v-else-if="item.aid === '2'">分区:宠物社区</p>
                <p v-else>分区:宠物百科</p>
                <p>标题:{{item.title}}</p>
                <p v-if="item.uploadImg.length" class="img-box">
                  <img v-lazy="item.uploadImg[0].path" />
                </p>
                <p v-if="item.uploadVideo.length" class="video-box">
                  <video :src="item.uploadVideo[0]"></video>
                </p>
                <p>发布时间:{{item.publishDate | fixDate}}</p>
                <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">查看详情</router-link>
                <span @click="deleteSellerArticle(index)">删除</span>
              </div>
            </div>
          </div>
          <div class="seller-good-box" v-else-if="sellerGoodList.length">
            <div class="seller-good-list" v-for="(item, index) in sellerGoodList" :key="index">
              <div class="seller-good-item">
                <p>商品分类:{{item.classification}}</p>
                <p class="img-box">
                  <img v-lazy="item.goodPic[0].path" />
                </p>
                <p>商品价格: ￥{{item.beforeDiscount}}/￥{{item.afterDiscount}}</p>
                <p>上架时间:{{item.putDate | fixDate}}</p>
                <span @click="deleteSellerGood(index)">删除</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-box">
            <h2>空列表</h2>
          </div>
        </el-collapse-item>
        <el-collapse-item title="卖家用户审核 VerifySellerUsers" name="3">
          <div class="verify-list" v-for="(item, index) in verifyStoreList" :key="index">
              <div class="verify-item">
                  <p>申请人实名:{{item.storeOwner}}</p>
                  <p>身份证号:{{item.storeOwnerCardID}}</p>
                  <p>店铺名:{{item.storeName}}</p>
                  <p class="store-mark">
                    <span>店铺图标</span>
                    <img v-lazy="item.storeMark[0].path" />
                  </p>
                  <p>经营地址:{{item.storeAddress}}</p>
                  <p>注册时间:{{item.registerDate | fixDate}}</p>
                  <p class="verify-btn">
                    <span @click="approved(index)">{{item.isActive? '审核已通过' : '审核通过'}}</span>
                    <span @click="notApproved(index)" v-if="!item.isActive">审核不通过</span>
                  </p>
              </div>
          </div>
        </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import axios from '@/api/axios'
import moment from 'moment'

export default {
  data() {
    return {
      activeName: '1',
      userList: [],
      sellerList: [],
      verifyStoreList: [],
      userArticleList: [],
      sellerArticleList: [],
      sellerGoodList: []
    }
  },
  async created() {
    const userlist = await axios.request({
      url: 'user/getAllOrdinaryUsers',
      method: 'post'
    })
    this.userList = userlist.data
    console.log(userlist.data)
    const sellerlist = await axios.request({
      url: 'user/getAllSellerUsers',
      method: 'post'
    })
    this.sellerList = sellerlist.data
    console.log(sellerlist.data)
    const verifystore = await axios.request({
      url: 'store/getVerifyStoreInfo',
      method: 'post'
    })
    this.verifyStoreList = verifystore.data
    console.log(this.verifyStoreList)
  },
  filters: {
    fixDate(date) {
      moment.locale('zh-cn')
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }
  },
  methods: {
    async checkArticle(index) {
      const res = await axios.request({
        url: 'article/getUserArticle',
        method: 'post',
        data: {
          userID: this.userList[index]._id
        }
      })
      this.userArticleList = res.data
      console.log(this.userArticleList)
    },
    async deleteArticle(index) {
      const res = await axios.request({
        url: 'article/deleteUserArticle',
        method: 'post',
        data: {
          _id: this.userArticleList[index]._id,
          userID: this.userArticleList[index].userID
        }
      })
      this.userArticleList = res.data
      console.log(this.userArticleList)
    },
    async checkSellerArticle(index) {
      const res = await axios.request({
        url: 'article/getUserArticle',
        method: 'post',
        data: {
          userID: this.sellerList[index]._id
        }
      })
      this.sellerArticleList = res.data
      console.log(this.sellerArticleList)
      this.sellerGoodList = []
    },
    async checkGood(index) {
      const res = await axios.request({
        url: 'good/getSellerGoods',
        method: 'post',
        data: {
          userID: this.sellerList[index]._id
        }
      })
      this.sellerGoodList = res.data
      console.log(this.sellerGoodList)
      this.sellerArticleList = []
    },
    async deleteSellerArticle(index) {
      const res = await axios.request({
        url: 'article/deleteUserArticle',
        method: 'post',
        data: {
          _id: this.sellerArticleList[index]._id,
          userID: this.sellerArticleList[index].userID
        }
      })
      this.sellerArticleList = res.data
      console.log(this.sellerArticleList)
    },
    async deleteSellerGood(index) {
      const res = await axios.request({
        url: 'good/deleteSellerGood',
        method: 'post',
        data: {
          _id: this.sellerGoodList[index]._id,
          storeID: this.sellerGoodList[index].storeID
        }
      })
      this.sellerGoodList = res.data
    },
    async approved(index) {
      if (this.verifyStoreList[index].isActive) {
        return 0
      } else {
        const res = await axios.request({
          url: 'store/approved',
          method: 'post',
          data: {
            _id: this.verifyStoreList[index]._id
          }
        })
        this.verifyStoreList = res.data
      }
    },
    async notApproved(index) {
      const res = await axios.request({
        url: 'store/notApproved',
        method: 'post',
        data: {
          _id: this.verifyStoreList[index]._id
        }
      })
      this.verifyStoreList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
#admini-interface {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    h1 {
        padding-top: 60px;
        color: #8896b3;
    }
    .el-collapse {
        margin-top: 30px;
        width: 80%;
        .el-collapse-item {
          .user-list {
            .user-item {
              display: flex;
              align-items: center;
              border-bottom: 3px solid lightseagreen;
              margin-top: 20px;
              p {
                width: 30%;
                font-size: 18px;
              }
              span {
                cursor: pointer;
                padding: 3px;
                color: #fff;
                background-color: lightsalmon;
              }
            }
          }
          .user-article-box {
            .user-article-list {
              .user-article-item {
                display: flex;
                align-items: center;
                margin-top: 10px;
                p {
                  width: 14%;
                  font-size: 16px;
                }
                a {
                  padding: 3px;
                  background-color: lightcoral;
                  color: #fff;
                }
                a:hover {
                  background-color: rgba(lightcoral,0.7);
                }
                span {
                  margin-left: 10px;
                  cursor: pointer;
                  padding: 3px 15px;
                  background-color: lightcoral;
                  color: #fff;
                }
                span:hover {
                  background-color: rgba(lightcoral,0.7);
                }
                .img-box {
                  width: 200px;
                  height: 150px;
                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }
                .video-box {
                  width: 200px;
                  height: 150px;
                  background-color: rgba(#000, 0.3);
                  video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }
              }
            }
          }
          .empty-box {
            position: relative;
            width: 100%;
            height: 180px;
            background: url('../assets/static/nocontent.png');
            background-repeat: no-repeat;
            background-position: center;
            h2 {
              position: absolute;
              bottom: 0px;
              left: 50%;
              transform: translateX(-50%);
              font-weight: 500;
            }
          }
          .seller-list {
            .seller-item {
              display: flex;
              align-items: center;
              border-bottom: 3px solid lightseagreen;
              margin-top: 20px;
              p {
                width: 27%;
                font-size: 18px;
              }
              span {
                margin-left: 10px;
                cursor: pointer;
                padding: 3px;
                color: #fff;
                background-color: lightsalmon;
              }
            }
          }
          .seller-good-box {
            .seller-good-list {
              .seller-good-item {
                display: flex;
                align-items: center;
                margin-top: 10px;
                p {
                  width: 20%;
                  font-size: 16px;
                  text-align: center;
                }
                .img-box {
                  width: 200px;
                  height: 150px;
                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }
                span {
                  margin-left: 10px;
                  cursor: pointer;
                  padding: 3px 15px;
                  background-color: lightcoral;
                  color: #fff;
                }
                span:hover {
                  background-color: rgba(lightcoral,0.7);
                }
              }
            }
          }
          .verify-list {
            .verify-item {
              display: flex;
              align-items: center;
              margin-top: 10px;
              p {
                width: 15%;
                font-size: 16px;
                text-align: center;
              }
              .store-mark {
                display: flex;
                flex-direction: column;
                img {
                  width: 100%;
                  height: 120px;
                }
              }
              .verify-btn {
                display: flex;
                flex-direction: column;
                span {
                  cursor: pointer;
                  padding: 3px 15px;
                  background-color: lightcoral;
                  color: #fff;
                }
                span:nth-of-type(2) {
                  margin-top: 10px;
                }
                span:hover {
                  background-color: rgba(lightcoral,0.7);
                }
              }
            }
          }
        }
    }
}
</style>
