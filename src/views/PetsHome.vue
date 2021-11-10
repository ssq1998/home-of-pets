<template>
  <div id="pets-home">
    <div class="pets-home-content">
      <div class="pets-operation-nav">
        <router-link to="/petshomecontent">全部视频</router-link>
        <router-link :to="{ name: 'PublishArticle', params: { block: 1 }}"><span class="public-video">我要上传</span></router-link>
        <span class="change-a-batch" @click="changeBatch"><i class="el-icon-refresh"></i>换一批</span>
      </div>
      <p class="video-title">{{firstVideo.title}}</p>
      <video id="pets-home-video" :src="firstVideo.uploadVideo" controls>
      </video>
      <ul class="pets-home-nav">
        <li v-for="(item, index) in videoList" :key="index">
          <video :src="item.uploadVideo[0]" @click="changevideo(item)"></video>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  data() {
    return {
      videoList: [],
      countNum: 4,
      firstVideo: {}
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
            aid: '1'
          }
        })
        this.videoList = res.data
        const articleIDList = []
        for (const item of res.data) {
          articleIDList.push(item._id)
        }
        if (res.data.length < 4) {
          const result = await axios.request({
            url: 'article/getPetsHomeVideo',
            method: 'post'
          })
          for (const item of result.data) {
            if (articleIDList.includes(item._id) === false) {
              articleIDList.push(item._id)
              this.videoList.push(item)
            }
          }
          this.videoList = this.videoList.splice(0,4)
          this.firstVideo = this.videoList[0]
        }
      } else {
        const res = await axios.request({
          url: 'article/getPetsHomeVideo',
          method: 'post'
        })
        this.videoList = res.data
        this.firstVideo = this.videoList[0]
      }
    } else {
      const res = await axios.request({
        url: 'article/getPetsHomeVideo',
        method: 'post'
      })
      this.videoList = res.data
      this.firstVideo = this.videoList[0]
    }
  },
  methods: {
    changevideo(message) {
      this.firstVideo = message
    },
    async changeBatch() {
      const res = await axios.request({
        url: 'article/changeBatch',
        method: 'post',
        data: {
          countNum: this.countNum
        }
      })
      if (res.data.length) {
        this.countNum += 4
        this.videoList = res.data
        this.firstVideo = this.videoList[0]
      } else {
        this.countNum = 0
        const result = await axios.request({
          url: 'article/changeBatch',
          method: 'post',
          data: {
            countNum: this.countNum
          }
        })
        this.countNum += 4
        this.videoList = result.data
        this.firstVideo = this.videoList[0]
      }
    }
  }
}
</script>

<style scoped lang="less">
#pets-home {
  .pets-home-content {
    position: relative;
    width: 100%;
    height: 100vh;
    .pets-operation-nav {
      position: absolute;
      right: 20px;
      top: 80px;
      z-index: 100;
      color: rgba(255, 255, 255, 0.5);
      transform: translateY(-30px);
      visibility: hidden;
      opacity: 0;
      transition: 0.5s;
      a:nth-of-type(1) {
        color: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 20px;
        padding: 5px 10px;
        margin-right: 20px;
      }
      .public-video {
        color: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 20px;
        padding: 5px 10px;
        margin-right: 20px;
      }
      .el-icon-refresh,.change-a-batch {
        cursor: pointer;
      }
      .el-icon-refresh {
        transition: 0.5s;
      }
      .change-a-batch:hover .el-icon-refresh {
        transform: rotate(360deg);
      }
    }
    .video-title {
      position: absolute;
      z-index: 100;
      left: 20px;
      top: 80px;
      font-size: 20px;
      color: #fff;
      transform: translateY(-30px);
      visibility: hidden;
      opacity: 0;
      transition: 0.5s;
    }
    #pets-home-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      background-color: rgba(#000, 0.3);
    }
    .pets-home-nav {
      position: absolute;
      bottom: 120px;
      right: 10px;
      transform: translateX(-50px);
      visibility: hidden;
      opacity: 0;
      transition: 0.5s;
      li {
        width: 120px;
        height: 80px;
        list-style: none;
        cursor: pointer;
        margin: 10px 0;
        background-color: #fff;
        padding: 3px;
        opacity: 0.3;
        transition: 0.5s;
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.5s;
        }
        // video:hover {
        //   opacity: 1;
        // }
      }
      li:hover {
        opacity: 1;
      }
    }
  }
  .pets-home-content:hover .pets-operation-nav {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
  .pets-home-content:hover .pets-home-nav {
    transform: translateX(0);
    visibility: visible;
    opacity: 1;
  }
  .pets-home-content:hover .video-title {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
