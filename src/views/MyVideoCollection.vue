<template>
    <div id="my-video-collection">
        <div class="my-video-collection-list" v-if="list.length">
            <div class="my-video-collection-item" v-for="(item,index) in list" :key="index">
              <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
                <div class="video-box">
                    <video :src="item.uploadVideo[0]" width="280px" height="180px"></video>
                </div>
                <div class="my-video-collection-info">
                    <div class="my-video-collection-title">{{item.title}}</div>
                    <div class="video-publisher">
                        <span class="iconfont icon-UPzhu"></span><span>{{item.username}}</span>
                    </div>
                    <div class="video-info">
                        <div class="sumInfo">
                            <span class="iconfont icon-bofangshu"></span><span>{{item.readingNumber}}</span>
                            <span class="iconfont icon-danmu"></span><span>{{item.comments.length}}</span>
                            <span class="iconfont icon-dianzan"></span><span>{{item.praiseList.length}}</span>
                        </div>
                        <div class="publishTime">{{item.publishDate | fixedDate}}</div>
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
import axios from 'axios'
import moment from 'moment'

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
        aid: '1'
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
#my-video-collection {
    width: 750px;
    background-color: rgba(#fff, 0.3);
    .my-video-collection-list {
        padding: 20px;
        .my-video-collection-item:hover {
            .my-video-collection-info {
                .my-video-collection-title {
                    color: skyblue;
                }
            }
        }
        .my-video-collection-item {
            cursor: pointer;
            a {
                display: flex;
                .video-box {
                    width: 280px;
                    height: 180px;
                    video {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        background-color: rgba(#fff,0.3);
                        border-radius: 8px;
                    }
                }
                .my-video-collection-info {
                    padding: 10px;
                    .my-video-collection-title {
                        font-weight: 800;
                        font-size: 20px;
                        height: 100px;
                    }
                    .video-publisher {
                        font-size: 18px;
                        color: #888;
                        padding: 5px 0;
                        .icon-UPzhu {
                            padding-right: 5px;
                            font-size: 18px;
                        }
                    }
                    .video-info {
                        width: 420px;
                        display: flex;
                        justify-content: space-between;
                        color: #888;
                        font-size: 16px;
                        .sumInfo {
                            .iconfont {
                                padding-right: 5px;
                                font-size: 18px;
                            }
                            .icon-danmu {
                                padding-left: 20px;
                                font-size: 14px;
                            }
                            .icon-dianzan {
                                padding-left: 20px;
                            }
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
