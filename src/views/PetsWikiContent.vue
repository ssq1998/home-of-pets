<template>
  <div id="pets-wiki-content">
    <div class="walking-lantern">
      <el-carousel height="400px">
        <el-carousel-item v-for="(item,index) in lanternList" :key="index">
          <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
            <img @click="addLanternReadingNumber(index)" v-lazy="item.uploadImg[1].path">
          </router-link>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="search-box">
      <input type="text" placeholder="输入文章关键词" v-model="searchText" @keyup.enter="searchSubmit" />
      <i class="iconfont icon-xingtaiduICON_sousuo---copy" @click="searchSubmit"></i>
    </div>
    <div class="pets-home-main">
      <div class="left-main">
        <div class="share-view-list" v-if="articleList.length">
          <div
            class="share-view-item"
            v-for="(item, index) in articleList"
            :key="index"
          >
            <div class="item-title">
              <div class="publisher-name">作者:{{ item.username }}</div>
              <div class="publish-time">{{ item.publishDate | fixedDate}}</div>
            </div>
            <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
              <div class="item-content" @click="addReadingNumber(index)">
                <p class="item-content-title">{{ item.title }}</p>
                <p class="item-content-script">{{ item.describe }}</p>
                <div class="img-box" v-if="item.uploadImg.length <= 3">
                  <div class="item-content-pic" v-for="(pic, picIndex) in item.uploadImg" :key="picIndex">
                    <img v-lazy="pic.path" />
                  </div>
                </div>
                <div class="img-box" v-else>
                  <div class="item-content-pic">
                    <img v-lazy="item.uploadImg[0].path" />
                    <img v-lazy="item.uploadImg[1].path" />
                    <img v-lazy="item.uploadImg[2].path" />
                    <div class="pic-num">+{{item.uploadImg.length}}</div>
                  </div>
                </div>
                <ul class="tags" v-for="(tag, tagIndex) in item.tags" :key="tagIndex">
                  <li>{{tag}}</li>
                </ul>
              </div>
            </router-link>
            <div class="item-footer">
              <div class="statistics-info">
                <span><i class="el-icon-view"></i>&nbsp;{{item.readingNumber}}</span>
                <span><i class="el-icon-chat-dot-square"></i>&nbsp;{{item.comments.length}}</span>
                <span><i class="iconfont icon-dianzan"></i>&nbsp;{{item.praiseList.length}}</span>
              </div>
            </div>
          </div>
          <div class="check-more" v-if="showLoadMoreBtn" @click="loadMoreArticle">点击加载更多</div>
        </div>
        <div class="empty-list" v-else>
          <h2>未搜索到相关文章</h2>
        </div>
      </div>
      <div class="right-main">
        <div class="publish-block">
          <div class="publish-block-title"><h2>发布</h2></div>
          <div class="publish-content">
            <div class="publish-box">
              <router-link :to="{ name: 'PublishArticle', params: { block: 3 }}">
                <el-button class="publish-button">
                  <i class="el-icon-edit"></i>
                  <span>创建词条</span>
                  <i class="el-icon-arrow-right"></i>
                </el-button>
              </router-link>
              <p class="publish-button-introduce">讨论,分享,宠物百科</p>
            </div>
          </div>
        </div>
        <div class="tag-search-box">
          <h3>搜索标签</h3>
          <div class="tag-search-list" v-for="(item,index) in tagSearchList" :key="index">
            <span @click="tagSearch(index)">{{item}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from '@/api/axios'

export default {
  data() {
    return {
      lanternList: [],
      articleList: [],
      searchText: '',
      showLoadMoreBtn: true,
      tagSearchList: []
    }
  },
  filters: {
    fixedDate(date) {
      moment.locale('zh-cn')
      return moment(date).startOf('hour').fromNow()
    }
  },
  async created() {
    if (localStorage.elementToken) {
      if (this.$store.state.userInfo.userInfo.visitList.length) {
        const res = await axios.request({
          url: 'article/getVisitedArticle',
          method: 'post',
          data: {
            visitList: this.$store.state.userInfo.userInfo.visitList,
            aid: '3'
          }
        })
        this.articleList = res.data
        const articleIDList = []
        for (const item of res.data) {
          articleIDList.push(item._id)
        }
        if (res.data.length < 4) {
          const result = await axios.request({
            url: 'article/getSomeWikiArticle',
            method: 'post',
            data: {
              len: 0
            }
          })
          for (const item of result.data) {
            if (articleIDList.includes(item._id) === false) {
              articleIDList.push(item._id)
              this.articleList.push(item)
            }
          }
          this.showLoadMoreBtn = false
        }
      } else {
        const result = await axios.request({
          url: 'article/getSomeWikiArticle',
          method: 'post',
          data: {
            len: 0
          }
        })
        this.articleList = result.data
      }
    } else {
      const result = await axios.request({
        url: 'article/getSomeWikiArticle',
        method: 'post',
        data: {
          len: 0
        }
      })
      this.articleList = result.data
    }
    const wikiLantern = await axios.request({
      url: 'article/getWikiLantern',
      method: 'post'
    })
    this.lanternList = wikiLantern.data
    const tagList = await axios.request({
      url: 'article/getAllTags',
      method: 'post',
      data: {
        aid: '3'
      }
    })
    this.tagSearchList = tagList.data.splice(0,5)
  },
  methods: {
    async loadMoreArticle() {
      const result = await axios.request({
        url: 'article/getSomeWikiArticle',
        method: 'post',
        data: {
          len: this.articleList.length
        }
      })
      this.articleList = this.articleList.concat(result.data)
    },
    async searchSubmit() {
      console.log(this.searchText)
      const res = await axios.request({
        url: '/article/searchArticle',
        method: 'post',
        data: {
          text: this.searchText,
          aid: 3
        }
      })
      this.articleList = res.data
      this.showLoadMoreBtn = false
    },
    async addReadingNumber(index) {
      this.articleList[index].readingNumber += 1
      await axios.request({
        url: 'article/addReadingNumber',
        method: 'post',
        data: {
          _id: this.articleList[index]._id,
          readingNumber: this.articleList[index].readingNumber
        }
      })
    },
    async addLanternReadingNumber(index) {
      this.lanternList[index].readingNumber += 1
      await axios.request({
        url: 'article/addReadingNumber',
        method: 'post',
        data: {
          _id: this.lanternList[index]._id,
          readingNumber: this.lanternList[index].readingNumber
        }
      })
    },
    async tagSearch(index) {
      const res = await axios.request({
        url: 'article/getTagArticle',
        method: 'post',
        data: {
          tag: this.tagSearchList[index],
          aid: '3'
        }
      })
      this.articleList = res.data
      this.showLoadMoreBtn = false
    }
  }
}
</script>

<style lang="less" scoped>
#pets-wiki-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .walking-lantern {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    .el-carousel {
      width: 70%;
      .el-carousel__item {
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  .search-box {
    height: 50px;
    position: relative;
    display: flex;
    width: 50%;
    align-items: center;
    input {
      width: 160px;
      position: absolute;
      right: 0px;
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
  .pets-home-main {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    .left-main {
      width: 50%;
      .share-view-list {
        border-radius: 5px;
        background-color: rgba(#fff, 0.5);
        .share-view-item {
          padding: 20px 25px;
          border-bottom: 1px solid #bedada;
          .item-title {
            display: flex;
            .publisher-name {
              line-height: 25px;
            }
            .publish-time {
              margin-left: 15px;
              line-height: 25px;
              color: #999;
              font-size: 13px;
            }
          }
          .item-content {
            cursor: pointer;
            .item-content-title {
              font-weight: 700;
              margin-top: 10px;
            }
            .item-content-script {
              font-size: 14px;
              color: #999;
              margin-top: 10px;
            }
            .img-box {
              .item-content-pic {
                position: relative;
                margin-top: 10px;
                display: inline-flex;
                img {
                  width: 150px;
                  height: 150px;
                  border-radius: 4px;
                  margin-right: 5px;
                }
                .pic-num {
                  position: absolute;
                  right: 5px;
                  background: rgba(#000,0.5);
                  width: 150px;
                  height: 150px;
                  border-radius: 4px;
                  color: #fff;
                  text-align: center;
                  line-height: 150px;
                  font-size: 30px;
                  opacity: 0;
                  z-index: -1;
                  transition: 0.2s;
                }
                .pic-num:hover {
                  background: rgba(#000,0.3);
                }
              }
              .item-content-pic:hover .pic-num {
                opacity: 1;
                z-index: 1;
              }
            }
            .tags {
              list-style: none;
              display: inline-flex;
              overflow: hidden;
              li {
                padding: 3px;
                background-color: lightcoral;
                border-radius: 5px;
                color: #fff;
                margin-right: 10px;
              }
            }
          }
          .item-content:hover .item-content-title{
            color: skyblue;
          }
          .item-footer {
            display: flex;
            justify-content: flex-end;
            span {
              margin-right: 10px;
              color: #999;
            }
          }
        }
        .check-more {
          background-color: rgba(#fff, 0.5);
          line-height: 80px;
          text-align: center;
          cursor: pointer;
          color: rgb(77, 87, 233);
        }
        .check-more:hover {
          color: rgba(77, 87, 233, 0.7);
        }
      }
      .empty-list {
        position: relative;
        width: 100%;
        height: 500px;
        background: url('../assets/static/nocontent.png');
        background-repeat: no-repeat;
        background-position: center;
        h2 {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          font-weight: 500;
        }
      }
    }
    .right-main {
      margin-left: 30px;
      display: flex;
      flex-direction: column;
      .publish-block {
        border-radius: 5px;
        background-color: rgba(#fff,0.5);
        .publish-block-title {
          height: 40px;
          line-height: 40px;
          font-size: 12px;
          text-align: center;
          border-bottom: 1px solid #bedada;
        }
        .publish-content {
          padding: 0 45px;
          display: flex;
          flex-direction: column;
          .publish-box {
            margin: 15px 0 10px;
            .publish-button {
              width: 140px;
              height: 40px;
              color: #7a5729;
              font-size: 16px;
              font-weight: 600;
              background-color: #ffe14c;
            }
            .publish-button-introduce {
              font-size: 13px;
              color: #475669;
              text-align: center;
            }
          }
        }
      }
      .tag-search-box {
        margin-top: 20px;
        h3 {
          color: #999;
        }
        .tag-search-list {
          display: flex;
          span {
            cursor: pointer;
            margin-top: 5px;
            background-color: lightcoral;
            color: #fff;
            padding: 3px 5px;
          }
        }
      }
    }
  }
}
</style>
