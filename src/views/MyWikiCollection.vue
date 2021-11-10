<template>
    <div id="my-wiki-collection">
        <div class="wiki-list" v-if="list.length">
            <div class="wiki-item" v-for="(item,index) in list" :key="index">
                <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
                    <div class="wiki-pic" v-if="item.uploadImg.length">
                        <img v-lazy="item.uploadImg[0].path">
                    </div>
                    <div class="wiki-video" v-if="item.uploadImg.length === 0 && item.uploadVideo.length">
                        <video :src="item.uploadVideo[0]"></video>
                    </div>
                    <div class="wiki-info-content">
                        <div class="wiki-title">{{item.title}}</div>
                        <div class="wiki-content">{{item.describe}}</div>
                        <div class="wiki-sumInfo">
                            <p class="publisher-name">{{item.username}}</p>
                            <p class="publish-time">{{item.publishDate | fixedDate}}</p>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="empty-list" v-else>
            <h3>你还没有收藏过该类文章哦</h3>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import axios from '@/api/axios'

export default {
  data() {
    return {
      list: []
    }
  },
  async created() {
    const res = await axios.request({
      url: 'article/getAllCollectArticle',
      method: 'post',
      data: {
        collectionList: this.$store.state.userInfo.userInfo.myCollectionList,
        aid: '3'
      }
    })
    this.list = res.data
  },
  filters: {
    fixedDate(date) {
      moment.locale('zh-cn')
      return moment(date).startOf('hour').fromNow()
    }
  }
}
</script>

<style lang="less" scoped>
#my-wiki-collection {
    width: 750px;
    background-color: rgba(#fff, 0.3);
    .wiki-list {
        padding: 20px;
        .wiki-item {
            margin-top: 10px;
            a {
                display: flex;
                justify-content: space-between;
                .wiki-pic {
                    width: 280px;
                    height: 150px;
                    border-radius: 4px;
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                .wiki-video {
                    width: 280px;
                    height: 150px;
                    border-radius: 4px;
                    video {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }
                .wiki-info-content {
                    width: 400px;
                    .wiki-title {
                        font-weight: 800;
                    }
                    .wiki-content {
                        height: 100px;
                        margin-top: 5px;
                        font-size: 18px;
                        color: #888;
                        overflow: hidden;
                    }
                    .wiki-sumInfo {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 16px;
                        p:nth-of-type(2) {
                            color: #333;
                        }
                    }
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
