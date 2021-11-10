<template>
  <div id="article-detail">
    <div class="article-container">
      <div class="header">
        <div class="header-up">
          <div class="publisher-info">
            <img :src="publisherInfo.userPhoto" >
            <h2>{{article.username}}</h2>
          </div>
          <div class="follow-btn" @click="changeFollow">{{followed? '已关注':'关注'}}</div>
        </div>
        <div class="header-down">{{article.publishDate | fixedDate}}</div>
      </div>
      <p class="article-title">{{article.title}}</p>
      <div class="img-box" v-if="article.uploadImg">
        <div class="img-container" v-for="(item,index) in article.uploadImg" :key="index">
          <el-image
            :src="item.path"
            :preview-src-list="uploadImgList"
            lazy>
          </el-image>
        </div>
      </div>
      <div class="video-box" v-if="article.uploadVideo">
        <div class="video-container" v-for="(item, index) in article.uploadVideo" :key="index">
          <video :src="item" controls></video>
        </div>
      </div>
      <div class="content-box">
        <p class="article-describe">{{article.describe}}</p>
        <p class="article-content" v-html="article.content"></p>
      </div>
      <div class="tags-box" v-if="article.tags">
        <ul v-for="(tag, tagIndex) in article.tags" :key="tagIndex">
          <li>{{tag}}</li>
        </ul>
      </div>
      <div class="operation-box">
        <div class="operation-btn" @click="changePraise"><span :class="{praised : praised}"><i class="iconfont icon-dianzan"></i>&nbsp;{{article.praiseList.length}}</span></div>
        <div class="operation-btn"><span @click="showComment"><i class="iconfont icon-pinglun"></i>&nbsp;{{article.comments.length}}</span></div>
        <div class="operation-btn" @click="changeCollect"><span :class="{collected : collected}"><i class="iconfont icon-shoucang"></i>&nbsp;{{collected? '已收藏' : '收藏'}}</span></div>
      </div>
      <div class="comment-box" v-if="showCommentBox">
        <div class="input-box">
          <p>回复</p>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="发表你的想法吧"
            v-model="textarea"
            resize="none">
          </el-input>
        </div>
        <div class="operation-nav">
          <p @click="removeComment">取消</p>
          <p @click="submitComment">发送</p>
        </div>
      </div>
      <div class="comment-content-box">
        <h2>评论区</h2>
        <div class="comment-container" v-if="article.comments.length">
          <div class="comment-levelOne-box" v-for="(levelOneItem, index) in article.comments" :key="index">
            <img v-lazy="levelOneItem.userPhoto" />
            <div class="comment-box-inner">
              <p v-if="levelOneItem.username !== article.username" class="commentator-name">{{levelOneItem.username}}</p>
              <p v-else class="author-name">{{levelOneItem.username}}&nbsp;<i class="iconfont icon-zuozhe"></i></p>
              <div class="comment-info-container">
                <p class="comment-date">{{levelOneItem.date | fixedDate}}</p>
                <div class="operation-nav">
                  <span @click="showLevelOneComment(index)">回复</span>
                </div>
              </div>
              <p class="comment-content">{{levelOneItem.content}}</p>
              <div class="comment-box" v-if="levelOneItem.showLevelOneCommentBox">
                <div class="input-box">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="发表你的想法吧"
                    v-model="levelOneItem.textarea"
                    resize="none">
                  </el-input>
                </div>
                <div class="operation-nav">
                  <p @click="removeLevelOneComment(index)">取消</p>
                  <p @click="submitLevelOneComment(index)">发送</p>
                </div>
              </div>
              <div class="comment-levelTwo-container" v-if="levelOneItem.childComments.length">
                <div class="comment-levelTwo-box" v-for="(levelTwoItem, levelTwoIndex) in levelOneItem.childComments" :key="levelTwoIndex">
                  <p v-if="levelTwoItem.username !== article.username"><span>{{levelTwoItem.username}}</span>&nbsp;回复&nbsp;<span>{{levelTwoItem.beCommented}}:</span>&nbsp;{{levelTwoItem.content}}</p>
                  <p v-else><span>{{levelTwoItem.username}}&nbsp;<i class="iconfont icon-zuozhe"></i></span><span>&nbsp;:&nbsp;{{levelTwoItem.content}}</span></p>
                  <div class="comment-levelTwo-nav">
                    <p>{{levelTwoItem.date | fixedDate}}</p>
                    <p @click="showLevelTwoComment(index,levelTwoIndex)">回复</p>
                  </div>
                  <div class="comment-box" v-if="levelTwoItem.showLevelTwoCommentBox">
                    <div class="input-box">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="发表你的想法吧"
                        v-model="levelTwoItem.textarea"
                        resize="none">
                      </el-input>
                    </div>
                    <div class="operation-nav">
                      <p @click="removeLevelTwoComment(index,levelTwoIndex)">取消</p>
                      <p @click="submitLevelTwoComment(index,levelTwoIndex)">发送</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-content" v-else>暂无评论哦</div>
      </div>
    </div>
    <div class="recommend-good-box">
      <h3>你可能会喜欢</h3>
      <div class="recommend-good-list" v-for="(item, index) in goodList" :key="index">
        <div class="recommend-good-item">
          <div class="img-box">
            <img v-lazy="item.goodPic[0].path" />
          </div>
          <div class="good-info">
            <p>{{item.goodName}}</p>
            <p><span>￥{{item.beforeDiscount}}</span>/<span>￥{{item.afterDiscount}}</span></p>
            <p @click="addToCart(index)">加入购物车</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
import moment from 'moment'
export default {
  data() {
    return {
      article: null,
      uploadImgList: [],
      textarea: '',
      showCommentBox: false,
      publisherInfo: {},
      goodList: []
    }
  },
  computed: {
    followed() {
      const attentionList = this.$store.state.userInfo.userInfo.myAttentionList
      if (attentionList.includes(this.publisherInfo._id)) {
        return true
      } else {
        return false
      }
    },
    praised() {
      const userID = this.$store.state.userInfo.userInfo._id
      if (this.article.praiseList.includes(userID)) {
        return true
      } else {
        return false
      }
    },
    collected() {
      const userID = this.$store.state.userInfo.userInfo._id
      if (this.article.collectList.includes(userID)) {
        return true
      } else {
        return false
      }
    }
  },
  async created() {
    this.article = this.$route.params.obj
    this.article.uploadImg.forEach((item,i,arr) => {
      this.uploadImgList.push(item.path)
    })
    const res = await axios.request({
      url: 'user/getArticleUserInfo',
      method: 'post',
      data: {
        _id: this.article.userID
      }
    })
    this.publisherInfo = res.data
    if (localStorage.elementToken) {
      const res = await axios.request({
        url: 'user/updateVisitList',
        method: 'post',
        data: {
          _id: this.$store.state.userInfo.userInfo._id,
          tagList: this.article.tags
        }
      })
      this.$store.dispatch('userInfo/setUserInfo', res.data)
    }
    const good = await axios.request({
      url: 'good/getVisitedArticleGood',
      method: 'post',
      data: {
        tags: this.article.tags
      }
    })
    this.goodList = good.data
    const goodIDList = []
    for (const item of good.data) {
      goodIDList.push(item._id)
    }
    if (good.data.length < 3) {
      const result = await axios.request({
        url: 'good/getArticleDetailGood',
        method: 'post'
      })
      for (const item of result.data) {
        if (goodIDList.includes(item._id) === false) {
          goodIDList.push(item._id)
          this.goodList.push(item)
        }
      }
      this.goodList = this.goodList.splice(0,3)
      console.log(this.goodList)
    }
  },
  filters: {
    fixedDate(date) {
      moment.locale('zh-cn')
      return moment(date).startOf('hour').fromNow()
    }
  },
  methods: {
    async changeFollow() {
      if (this.article.userID === this.$store.state.userInfo.userInfo._id) {
        return this.$message({
          type: 'warning',
          message: '这篇文章是你的哦'
        })
      }
      const res = await axios.request({
        url: 'user/followArticlePublisher',
        method: 'post',
        data: {
          _id: this.$store.state.userInfo.userInfo._id,
          publisherID: this.publisherInfo._id,
          state: this.followed
        }
      })
      this.$store.dispatch('userInfo/setUserInfo', res.data)
    },
    async changePraise() {
      if (this.article.userID === this.$store.state.userInfo.userInfo._id) {
        return this.$message({
          type: 'warning',
          message: '这篇文章是你的哦'
        })
      }
      const res = await axios.request({
        url: 'user/praiseArticle',
        method: 'post',
        data: {
          userID: this.$store.state.userInfo.userInfo._id,
          articleID: this.article._id,
          state: this.praised
        }
      })
      this.article = res.data
    },
    async changeCollect() {
      if (this.article.userID === this.$store.state.userInfo.userInfo._id) {
        return this.$message({
          type: 'warning',
          message: '这篇文章是你的哦'
        })
      }
      const res = await axios.request({
        url: 'user/collectArticle',
        method: 'post',
        data: {
          userID: this.$store.state.userInfo.userInfo._id,
          articleID: this.article._id,
          state: this.collected
        }
      })
      this.article = res.data.newArticle
      this.$store.dispatch('userInfo/setUserInfo', res.data.newUser)
    },
    showComment() {
      this.showCommentBox = true
    },
    removeComment() {
      this.showCommentBox = false
    },
    showLevelOneComment(index) {
      this.article.comments[index].showLevelOneCommentBox = true
    },
    removeLevelOneComment(index) {
      this.article.comments[index].showLevelOneCommentBox = false
    },
    showLevelTwoComment(index,levelTwoIndex) {
      this.article.comments[index].childComments[levelTwoIndex].showLevelTwoCommentBox = true
    },
    removeLevelTwoComment(index,levelTwoIndex) {
      this.article.comments[index].childComments[levelTwoIndex].showLevelTwoCommentBox = false
    },
    async submitComment() {
      if (!this.textarea) {
        this.$message({
          type: 'warning',
          message: '请输入评论内容再发送哦'
        })
        return
      }
      const result = await axios.request({
        url: 'article/submitComment',
        method: 'post',
        data: {
          _id: this.article._id,
          username: this.$store.state.userInfo.userInfo.username,
          date: new Date(),
          content: this.textarea,
          childComments: [],
          showLevelOneCommentBox: false,
          userPhoto: this.$store.state.userInfo.userInfo.userPhoto,
          textarea: ''
        }
      })
      this.article = result.data
      this.textarea = ''
    },
    async submitLevelOneComment(index) {
      if (!this.article.comments[index].textarea) {
        this.$message({
          type: 'warning',
          message: '请输入评论内容再发送哦'
        })
        return
      }
      const beCommented = this.article.comments[index].username
      const result = await axios.request({
        url: 'article/submitChildComment',
        method: 'post',
        data: {
          idx: index,
          _id: this.article._id,
          username: this.$store.state.userInfo.userInfo.username,
          beCommented: beCommented,
          date: new Date(),
          content: this.article.comments[index].textarea,
          showLevelTwoCommentBox: false,
          textarea: ''
        }
      })
      this.article = result.data
    },
    async submitLevelTwoComment(index,levelTwoIndex) {
      if (!this.article.comments[index].childComments[levelTwoIndex].textarea) {
        this.$message({
          type: 'warning',
          message: '请输入评论内容再发送哦'
        })
        return
      }
      const beCommented = this.article.comments[index].childComments[levelTwoIndex].username
      const result = await axios.request({
        url: 'article/submitAppendChildComment',
        method: 'post',
        data: {
          idx: index,
          _id: this.article._id,
          username: this.$store.state.userInfo.userInfo.username,
          beCommented: beCommented,
          date: new Date(),
          content: this.article.comments[index].childComments[levelTwoIndex].textarea,
          showLevelTwoCommentBox: false,
          textarea: ''
        }
      })
      this.article = result.data
    },
    async addToCart(index) {
      await axios.request({
        url: 'cart/addToCart',
        method: 'post',
        data: {
          goodID: this.goodList[index]._id,
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
#article-detail {
  width: 100%;
  padding-top: 60px;
  display: flex;
  justify-content: center;
  position: relative;
  .article-container {
    border: 1px solid #fff;
    padding: 10px;
    margin-top: 20px;
    width: 50%;
    .header {
      width: 100%;
      .header-up {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .publisher-info {
          display: flex;
          align-items: center;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
          h2 {
            margin-left: 10px;
            color: #333;
            font-weight: 500;
          }
        }
        .follow-btn {
          width: 80px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border: 1px solid rgba(lightcoral,0.7);
          border-radius: 20px;
          color: rgba(lightcoral,0.7);
          cursor: pointer;
          transition: 0.2s;
        }
        .follow-btn:hover {
          border: 1px solid rgba(lightcoral,1);
          color: rgba(lightcoral,1);
        }
      }
      .header-down {
        margin-top: 10px;
        color: darkgray;
      }
    }
    .article-title {
      margin-top: 20px;
      font-size: 18px;
    }
    .img-box {
      width: 100%;
      display:flex;
      flex-wrap: wrap;
      .img-container {
        width: calc(calc(100% / 3) - 10px);
        margin:5px;
        height:170px;
        .el-image {
          width: 100%;
          height: 100%;
        }
      }
    }
    .video-box {
      .video-container {
        position: relative;
        width: 100%;
        height: 400px;
        video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
    .content-box {
      .article-describe {
        margin-top: 10px;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
      .article-content {
        margin-top: 10px;
        word-wrap: break-word;
        white-space: pre-wrap;
        font-size: 18px;
      }
    }
    .tags-box {
      ul {
        list-style: none;
        display: inline-block;
        margin-top: 20px;
        overflow: hidden;
        li {
          margin-right: 10px;
          padding: 3px;
          border: 1px solid lightcoral;
          border-radius: 4px;
          color: lightcoral;
        }
      }
    }
    .operation-box {
      width: 100%;
      display:flex;
      border-top: 1px solid #fff;
      .operation-btn {
        width: calc(100% / 3);
        height: 50px;
        text-align: center;
        line-height: 50px;
        span {
          color: gray;
          font-size: 18px;
          cursor: pointer;
          transition: 0.2s;
          .iconfont {
            font-size: 18px;
          }
        }
        .praised {
          color: lightcoral;
        }
        .collected {
          color: lightcoral;
        }
        span:hover {
          font-size: 22px;
          color: lightcoral;
        }
        span:hover .iconfont {
          font-size: 22px;
          color: lightcoral;
        }
      }
    }
    .comment-box {
      padding: 10px;
      .input-box {
        display: flex;
        p {
          width: 50px;
        }
      }
      .operation-nav {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
        p:nth-of-type(1) {
          line-height: 30px;
          color: #333;
          margin-right: 10px;
          cursor: pointer;
        }
        p:nth-of-type(2) {
          width: 50px;
          line-height: 30px;
          text-align: center;
          background-color: lightcoral;
          color: white;
          cursor: pointer;
        }
      }
    }
    .comment-content-box {
      h2 {
        margin-top: 20px;
        width: 100px;
        text-align: center;
        font-weight: 600;
        border-bottom: 5px solid lightcoral;
      }
      .comment-container {
        .comment-levelOne-box {
          margin-top: 30px;
          display: flex;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
          .comment-box-inner {
            margin-left: 10px;
            .commentator-name {
              color: #333;
            }
            .author-name {
              color: lightcoral;
            }
            .comment-info-container {
              margin-top: 5px;
              width: 650px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .comment-date {
                color: gray;
              }
              .operation-nav {
                color: gray;
                span {
                  cursor: pointer;
                }
                span:hover {
                  color: lightcoral;
                }
              }
            }
            .comment-content {
              margin-top: 10px;
            }
            .comment-levelTwo-container {
              background-color: rgba(#fff, 0.3);
              margin-top: 10px;
              padding: 10px;
              .comment-levelTwo-box {
                padding: 5px;
                p:nth-of-type(1) {
                  color: #333;
                  span {
                    color: lightcoral;
                  }
                }
                .comment-levelTwo-nav {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 5px;
                  p:nth-of-type(1) {
                    font-size: 14px;
                  }
                  p:nth-of-type(2) {
                    cursor: pointer;
                    opacity: 0;
                    z-index: -1;
                    transition: 0.2s;
                  }
                  p:nth-of-type(2):hover {
                    color: lightcoral;
                  }
                }
              }
              .comment-levelTwo-box:hover .comment-levelTwo-nav p:nth-of-type(2) {
                opacity: 1;
                z-index: 1;
              }
            }
          }
        }
      }
      .empty-content {
        color: gray;
        text-align: center;
        line-height: 200px;
      }
    }
  }
  .recommend-good-box {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background-color: lightcyan;
    padding: 10px 10px 0;
    h3 {
      text-align: center;
      color: #999;
    }
    .recommend-good-list {
      .recommend-good-item {
        display: flex;
        align-items: center;
        margin-top: 10px;
        .img-box {
          width: 150px;
          height: 150px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .good-info {
          p:nth-of-type(1) {
            color: #333;
          }
          p:nth-of-type(2) {
            span {
              color: rgb(173, 8, 8);
            }
            span:nth-of-type(1) {
              text-decoration: line-through;
            }
          }
          p:nth-of-type(3) {
            background-color: lightcoral;
            color: #fff;
            width: 100px;
            padding: 5px 0;
            text-align: center;
            cursor: pointer;
          }
          p:nth-of-type(3):hover {
            background-color: rgba(lightcoral,0.7);
          }
        }
      }
    }
  }
}
</style>
