<template>
  <main id="pets-wiki">
    <section class="pets-wiki-container">
      <div class="awesome-box">
        <div class="statistics-info-block">
          <h1>宠物百科</h1>
          <h2>让我们更好地了解我们的宠物朋友</h2>
          <div>
            <span><i class="iconfont icon-jilu"></i></span>
            <span>{{ keywordNumber }}个词条</span>
          </div>
          <div>
            <span><i class="iconfont icon-bianji"></i></span>
            <span>{{ editNumber }}次编辑</span>
          </div>
          <div>
            <span><i class="iconfont icon-ren"></i></span>
            <span>{{ authorNumber }}人编写</span>
          </div>
          <div class="edit-button">
            <router-link :to="{ name: 'PublishArticle', params: { block: 3 } }"
              ><i class="iconfont icon-bianji"></i>&nbsp;创建词条</router-link
            >
          </div>
          <div class="to-petswikicontent"><router-link to="/petswikicontent">更多内容</router-link></div>
        </div>
      </div>
      <div class="awesome-box">
        <div class="hot-search-block">
          <h2>热搜词条</h2>
          <div class="hot-search-content">
            <div
              class="hot-search-item"
              v-for="(item, index) in hotSearchList"
              :key="index"
            >
              <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
                <h2 @click="addHotSearchReadingNumber(index)">
                  {{ item.title }}&nbsp;<i class="iconfont icon-hot"></i>
                </h2>
                <p>{{ item.describe }}</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="awesome-box">
        <div class="pets-trivia-block">
          <h2>宠物冷知识</h2>
          <div class="pets-trivia-content">
            <div
              class="pets-trivia-item"
              v-for="(item, index) in petsTriviaList"
              :key="index"
            >
              <h2>
                {{ item.title }}&nbsp;<i class="iconfont icon-xuehua"></i>
              </h2>
              <div class="brief-info">
                <img v-lazy="item.uploadImg[0].path" />
                <div class="brief-introduction">
                  {{ item.describe }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="awesome-box">
        <div class="wiki-user-block">
          <h2>百科用户</h2>
          <div class="wiki-user-card">
            <div
              class="wiki-user-item"
              v-for="(item, index) in wikiUserList"
              :key="index"
            >
              <div class="img-box">
                <img v-lazy="item.userPhoto" />
              </div>
              <div class="item-top-box">
                <h2>{{ item.username }}</h2>
                <p>{{ item.signature }}</p>
              </div>
              <div class="item-bottom-box">
                <div class="describe">创意协作分享</div>
                <div class="more-btn">了解更多</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from '@/api/axios'
export default {
  data() {
    return {
      keywordNumber: '11155564',
      editNumber: '111',
      authorNumber: '111',
      hotSearchList: [],
      petsTriviaList: [],
      wikiUserList: []
    }
  },
  async created() {
    const hotSearch = await axios.request({
      url: 'article/getSomeWikiArticle',
      method: 'post',
      data: {
        len: 0
      }
    })
    const petsTrivia = await axios.request({
      url: 'article/getSomeWikiArticle',
      method: 'post',
      data: {
        len: 4
      }
    })
    const users = await axios.request({
      url: 'user/getSomeUsers',
      method: 'post'
    })
    this.hotSearchList = hotSearch.data
    this.petsTriviaList = petsTrivia.data
    this.wikiUserList = users.data
  },
  methods: {
    async addHotSearchReadingNumber(index) {
      this.hotSearchList[index].readingNumber += 1
      await axios.request({
        url: 'article/addReadingNumber',
        method: 'post',
        data: {
          _id: this.hotSearchList[index]._id,
          readingNumber: this.hotSearchList[index].readingNumber
        }
      })
    },
    async addPetsTriviaReadingNumber(index) {
      this.petsTriviaList[index].readingNumber += 1
      await axios.request({
        url: 'article/addReadingNumber',
        method: 'post',
        data: {
          _id: this.petsTriviaList[index]._id,
          readingNumber: this.petsTriviaList[index].readingNumber
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#pets-wiki {
  position: relative;
  .pets-wiki-container {
    position: relative;
    width: 100%;
    height: 100vh;
    // overflow: auto;
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
    .awesome-box:hover::before {
      background-color: rgba(0, 0, 0, 0.2);
    }
    .awesome-box::before {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      transition: all 0.3s ease;
    }
    .awesome-box {
      position: relative;
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      scroll-snap-align: center;
    }
    .awesome-box:nth-child(1) {
      background: rgba(255, 255, 255, 0.5)
        url('../assets/bgimage/01e582e07a5d452ea748732949aeb2ef.jpeg');
      background-size: cover;
      background-attachment: fixed;
      background-position: center;
      background-blend-mode: multiply;
      .statistics-info-block {
        background-color: rgba(#fff, 0.5);
        position: absolute;
        width: 400px;
        height: 400px;
        right: 200px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
        color: rgb(11, 119, 161);
        h1 {
          margin-top: 25px;
        }
        h2 {
          margin-top: 30px;
          font-weight: 500;
        }
        div {
          margin-top: 25px;
          width: 50%;
          font-size: 22px;
          display: flex;
          justify-content: space-between;
          .iconfont {
            font-size: 22px;
          }
        }
        .edit-button {
          width: 180px;
          height: 40px;
          line-height: 40px;
          background-color: rgb(11, 119, 161);
          border-radius: 5px;
          a {
            margin: 0 auto;
            color: #fff;
          }
        }
        .edit-button:hover {
          background-color: rgb(27, 103, 133);
        }
        .to-petswikicontent {
          margin-top: 10px;
          display: flex;
          justify-content: center;
          a {
            color: rgb(27, 103, 133);
            font-size: 16px;
          }
        }
      }
    }
    .awesome-box:nth-child(2) {
      background: rgba(255, 255, 255, 0.5)
        url('../assets/bgimage/bf67b78fdb8745f6b6fefa812984f311.png');
      background-size: cover;
      background-attachment: fixed;
      background-position: center;
      background-blend-mode: multiply;
      .hot-search-block {
        width: 100vw;
        padding: 0 100px;
        h2 {
          color: #fff;
          font-weight: 500;
        }
        .hot-search-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          .hot-search-item {
            border-top: 1px solid #b9b1b1;
            padding: 20px 10px;
            h2 {
              font-size: 25px;
              margin-bottom: 10px;
              .icon-hot {
                font-size: 20px;
                color: red;
              }
            }
            p {
              color: lightcyan;
            }
          }
        }
      }
    }
    .awesome-box:nth-child(3) {
      background: rgba(255, 255, 255, 0.5)
        url('../assets/bgimage/20080702_2580a948e43f182c79fcSLtX7YRYeqSp.jpg');
      background-size: cover;
      background-attachment: fixed;
      background-position: center;
      background-blend-mode: multiply;
      .pets-trivia-block {
        padding: 0 100px;
        h2 {
          color: #fff;
          font-weight: 500;
        }
        .pets-trivia-content {
          .pets-trivia-item {
            border-top: 1px solid #b9b1b1;
            padding: 10px 10px;
            h2 {
              margin-bottom: 10px;
              .icon-xuehua {
                font-size: 25px;
                color: rgb(96, 151, 233);
              }
            }
            .brief-info {
              display: flex;
              img {
                width: 120px;
                height: 90px;
                object-fit: cover;
              }
              .brief-introduction {
                margin-left: 30px;
                color: lightcyan;
              }
            }
          }
        }
      }
    }
    .awesome-box:nth-child(4) {
      background: rgba(255, 255, 255, 0.5)
        url('../assets/bgimage/0371928572070fc6ac72538126dd812.jpg');
      background-size: cover;
      background-attachment: fixed;
      background-position: center;
      background-blend-mode: multiply;
      .wiki-user-block {
        h2 {
          font-weight: 500;
          color: #fff;
        }
        .wiki-user-card {
          position: relative;
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .wiki-user-item {
            background-color: #fff;
            height: 290px;
            width: 350px;
            margin: 0 20px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
            transition: 0.4s;
            .img-box {
              height: 200px;
              width: 100%;
              img {
                height: 100%;
                width: 100%;
                object-fit: cover;
              }
            }
            .item-top-box {
              text-align: center;
              padding: 5px;
              h2 {
                font-weight: 600;
                color: #202020;
              }
              p {
                font-size: 20px;
                font-weight: 600;
                color: #e74c3c;
              }
            }
            .item-bottom-box {
              background-color: #fff;
              text-align: center;
              padding: 0 20px 10px;
              margin-top: 5px;
              opacity: 0;
              visibility: hidden;
              transition: 0.2s;
              .describe {
                letter-spacing: 1px;
              }
              .more-btn {
                width: 100px;
                margin: 10px 0;
                text-align: center;
                background-color: #e74c3c;
                color: #f2f2f2;
                padding: 5px 8px;
                border-radius: 3px;
                transition: 0.2s;
                cursor: pointer;
              }
              .more-btn:hover {
                // transform: scale(0.9);
              }
            }
          }
          .wiki-user-item:hover .item-bottom-box {
            opacity: 1;
            visibility: visible;
          }
          .wiki-user-item:hover {
            height: 470px;
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
  }
}
</style>
