<template>
  <div id="pets-home-content">
    <div class="search-box">
      <input type="text" placeholder="输入搜索关键词" v-model="searchText" @keyup.enter="searchSubmit" />
      <i class="iconfont icon-xingtaiduICON_sousuo---copy" @click="searchSubmit"></i>
    </div>
    <div class="main-box">
      <div class="show-video-box">
        <div class="show-video-list" v-for="(item, index) in currentVideoList" :key="index">
          <div class="show-video-item" @click="addReadingNumber(index)">
            <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
              <video id="video-item" :src="item.uploadVideo[0]">
              </video>
              <p class="item-title">{{item.title}}</p>
              <div class="item-info-box">
                <p class="item-username"><i class="iconfont icon-zuozhe"></i>&nbsp;{{item.username}}</p>
                <p class="item-reading-num">播放量:&nbsp;{{item.readingNumber}}次</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="tag-search-box">
        <h3>搜索标签</h3>
        <div class="tag-search-list" v-for="(item,index) in tagSearchList" :key="index">
          <p @click="tagSearch(index)">{{item}}</p>
        </div>
      </div>
    </div>
    <div class="paging-box">
      <div class="hide-paging-box" v-if="pageCount === '1'">
        <span>隐藏分页</span>
        <el-switch v-model="hidePaging"></el-switch>
      </div>
      <el-pagination
        background
        :page-count="pageCount"
        :hide-on-single-page="hidePaging"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        :total="totalVideoListLength">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  data() {
    return {
      hidePaging: false,
      pageSize: 12,
      currentPage: 1,
      currentVideoList: [],
      totalVideoListLength: 0,
      searchText: '',
      tagSearchList: []
    }
  },
  async created() {
    const res = await axios.request({
      url: 'article/getPagingvideo',
      method: 'post',
      data: {
        pageSize: 12,
        pageNum: 1
      }
    })
    this.currentVideoList = res.data.article
    this.totalVideoListLength = res.data.allNum
    const tagList = await axios.request({
      url: 'article/getAllTags',
      method: 'post',
      data: {
        aid: '1'
      }
    })
    this.tagSearchList = tagList.data.splice(0,5)
  },
  computed: {
    pageCount() {
      return Math.floor(this.totalVideoListLength / 12)
    },
    isSearching() {
      if (this.searchText) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async handleCurrentChange(val) {
      if (this.isSearching === true) {
        const res = await axios.request({
          url: 'article/searchVideo',
          method: 'post',
          data: {
            text: this.searchText,
            aid: 1,
            pageSize: 12,
            pageNum: val
          }
        })
        if (res.data.article.length) {
          this.currentVideoList = []
          this.currentVideoList.push(...res.data.article)
        }
      } else {
        const result = await axios.request({
          url: 'article/getPagingvideo',
          method: 'post',
          data: {
            pageSize: 12,
            pageNum: val
          }
        })
        if (result.data.article.length) {
          this.currentVideoList = []
          this.currentVideoList.push(...result.data.article)
          this.totalVideoListLength = result.data.allNum
        }
      }
    },
    async searchSubmit() {
      const res = await axios.request({
        url: 'article/searchVideo',
        method: 'post',
        data: {
          text: this.searchText,
          aid: 1,
          pageSize: 12,
          pageNum: 1
        }
      })
      this.currentVideoList = res.data.article
      this.totalVideoListLength = res.data.len
    },
    async addReadingNumber(index) {
      this.currentVideoList[index].readingNumber += 1
      await axios.request({
        url: 'article/addReadingNumber',
        method: 'post',
        data: {
          _id: this.currentVideoList[index]._id,
          readingNumber: this.currentVideoList[index].readingNumber
        }
      })
    },
    async tagSearch(index) {
      const res = await axios.request({
        url: 'article/searchVideo',
        method: 'post',
        data: {
          text: this.tagSearchList[index],
          aid: '1',
          pageSize: 12,
          pageNum: 1
        }
      })
      this.currentVideoList = res.data.article
      this.totalVideoListLength = res.data.len
    }
  }
}
</script>

<style lang="less" scoped>
#pets-home-content {
  padding: 60px 0 0;
  .search-box {
    height: 50px;
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    right: 50px;
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
  .main-box {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
    .show-video-box {
      margin-left: 30px;
      width: 90%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .show-video-list {
        .show-video-item {
          margin: 10px 12px 0;
          position: relative;
          width: 300px;
          height: 225px;
          transition: 0.2s;
          #video-item {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 5px;
          }
          .item-title {
            position: absolute;
            bottom: 10px;
            margin-left: 15px;
            width: 100%;
            color: #fff;
            font-size: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: 0.2s;
          }
          .item-info-box {
            position: absolute;
            bottom: -40px;
            margin-left: 15px;
            margin-top: 10px;
            color: #fff;
            opacity: 0;
            z-index: -1;
            transition: 0.2s;
            .item-reading-num {
              margin-top: 5px;
            }
          }
        }
        .show-video-item:hover .item-title {
          bottom: 60px;
          line-height: 24px;
          height: 96px;
        }
        .show-video-item:hover .item-info-box {
          bottom: 30px;
          opacity: 1;
          z-index: 1;
        }
      }
    }
    .tag-search-box {
      h3 {
        color: #999;
      }
      .tag-search-list {
        display: flex;
        align-items: center;
        p {
          cursor: pointer;
          margin-top: 5px;
          background-color: lightcoral;
          color: #fff;
          padding: 3px 5px;
        }
      }
    }
  }
  .paging-box {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .hide-paging-box {
      span {
        margin-right: 10px;
        color: #333;
      }
    }
  }
}
</style>
