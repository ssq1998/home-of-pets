<template>
    <div id="my-article-collection">
        <div class="my-article-collection-list" v-if="list.length">
            <div class="my-article-collection-item" v-for="(item,index) in list" :key="index">
                <div class="item-title">
                    <p>{{item.username}}</p>
                    <p>{{item.publishDate | fixedDate}}</p>
                </div>
                <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
                    <div class="item-content">
                        <p class="item-content-title">{{item.title}}</p>
                        <p class="item-content-script">{{item.describe}}</p>
                        <div class="img-box" v-if="item.uploadImg.length <= 3">
                            <div class="item-content-pic" v-for="(imgItem,index) in uploadImg" :key="index">
                                <img v-lazy="imgItem.path">
                            </div>
                        </div>
                        <div v-else>
                            <div class="item-content-pic">
                                <img v-lazy="item.uploadImg[0].path">
                                <img v-lazy="item.uploadImg[1].path">
                                <img v-lazy="item.uploadImg[2].path">
                            </div>
                        </div>
                    </div>
                </router-link>
                <div class="item-footer">
                    <div class="item-sumInfo">
                        <p><i class="el-icon-view"></i><span>{{item.readingNumber}}</span></p>
                        <p><i class="el-icon-chat-dot-square"></i><span>{{item.comments.length}}</span></p>
                        <p><i class="iconfont icon-dianzan"></i><span>{{item.praiseList.length}}</span></p>
                    </div>
                </div>
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
        aid: '2'
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
#my-article-collection {
    width: 750px;
    background-color: rgba(#fff, 0.3);
    .my-article-collection-list {
        padding: 20px;
        .my-article-collection-item {
            .item-title {
                display: flex;
                align-items: center;
                height: 25px;
                font-size: 16px;
                p:nth-of-type(2) {
                    margin-left: 20px;
                    color: #999;
                }
            }
            .item-content {
                cursor: pointer;
                .item-content-title {
                    font-size: 16px;
                    font-weight: 700;
                    padding: 10px 0 5px;
                }
                .item-content-script {
                    font-size: 14px;
                    color: #999;
                    padding: 5px 0;
                }
                .item-content-pic {
                    padding: 5px 0;
                    img {
                        margin-right: 5px;
                        width: 150px;
                        height: 150px;
                        border-radius: 4px;
                    }
                }
            }
            .item-content:hover {
                .item-content-title {
                    color: skyblue;
                }
            }
            .item-footer {
                display: flex;
                justify-content: flex-end;
                .item-sumInfo {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    font-size: 16px;
                    color: #999;
                    p {
                        margin-right: 20px;
                        i {
                            margin-right: 5px;
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
