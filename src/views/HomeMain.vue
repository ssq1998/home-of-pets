<template>
  <div id="home-main">
    <div class="home-main-container">
      <a name="banner1"></a>
      <div class="bannar-container">
        <div class="home-header">
          <el-carousel height="75vh">
            <el-carousel-item v-for="(item,index) in bannerList" :key="index">
              <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
                <img v-lazy="item.uploadImg[2].path">
              </router-link>
            </el-carousel-item>
          </el-carousel>
          <div class="jump-to-next"><a href="#banner2"><i class="iconfont icon-xiajiang"></i></a></div>
        </div>
      </div>
      <div class="bannar-container">
        <a name="banner2"></a>
        <div class="pets-home-container">
          <h2>分享你与爱宠的日常</h2>
          <div class="pets-home">
            <div class="video-list" v-for="(item, index) in videoList" :key="index">
              <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
                <div class="video-item">
                  <video id="pets-home-video" :src="item.uploadVideo[0]" controls>
                  </video>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div class="jump-to-next"><a href="#banner3"><i class="iconfont icon-xiajiang"></i></a></div>
      </div>
      <div class="bannar-container">
        <a name="banner3"></a>
        <h2>记录萌宠的每一个精彩瞬间</h2>
        <div class="pets-community">
          <div class="pets-community-container">
            <div class="pets-community-card" v-for="(item, index) in communityList" :key="index">
              <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
                <img v-lazy="item.uploadImg[0].path">
              </router-link>
            </div>
          </div>
        </div>
        <div class="jump-to-next"><a href="#banner4"><i class="iconfont icon-xiajiang"></i></a></div>
      </div>
      <div class="bannar-container">
        <a name="banner4"></a>
        <h2>怎么更爱你的宠物<i class="iconfont icon-wenhao"></i>你可能缺了它</h2>
        <div class="pets-store">
          <div class="pets-store-card" v-for="(item, index) in petsstore" :key="index">
            <div class="img-box">
              <img v-lazy="item.goodPic[0].path">
            </div>
            <div class="content-box">
              <h3 class="goods-name">{{ item.goodName }}</h3>
              <p class="goods-price">￥{{ item.afterDiscount }}</p>
              <div class="add-cart-btn">加入购物车</div>
            </div>
          </div>
        </div>
        <div class="jump-to-next"><a href="#banner5"><i class="iconfont icon-xiajiang"></i></a></div>
      </div>
      <div class="bannar-container">
        <a name="banner5"></a>
        <h2></h2>
        <div class="pets-wiki">
          <div class="pets-wiki-card" v-for="(item, index) in wikiArticleList" :key="index">
            <div class="img-wiki-box">
              <router-link :to="{ name: 'ArticleDetail', params: { obj: item }}">
                <img v-lazy="item.uploadImg[0].path">
              </router-link>
            </div>
            <div class="content-wiki-box">
              <div>
                <p>{{ item.title }}</p>
                <p>作者:{{ item.username }}</p>
                <p>{{ item.describe }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="jump-to-top"><a href="#banner1"><i class="iconfont icon-shangsheng1"></i></a></div>
      </div>
      <footer-com></footer-com>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
import { getHomepageGoods } from '@/api/homepage'
import FooterCom from '../components/FooterCom.vue'

export default {
  data() {
    return {
      bannerList: [],
      videoList: [],
      communityList: [],
      petsstore: [],
      wikiArticleList: []
    }
  },
  components: {
    FooterCom
  },
  methods: {
  },
  async created() {
    const bannar = await axios.request({
      url: 'homepage/getHomepageBanner',
      method: 'post'
    })
    this.bannerList = bannar.data
    const videoData = await axios.request({
      url: 'homepage/getHomepageVideo',
      method: 'post'
    })
    this.videoList = videoData.data
    const communityArticle = await axios.request({
      url: 'article/getCommunityLantern',
      method: 'post'
    })
    this.communityList = communityArticle.data
    const homepageGoods = await getHomepageGoods()
    this.petsstore = homepageGoods.data
    const wikiArticle = await axios.request({
      url: 'article/getSomeWikiArticle',
      method: 'post',
      data: {
        len: 0
      }
    })
    this.wikiArticleList = wikiArticle.data
  }
}
</script>

<style lang="less" scoped>

@keyframes jumpStyle {
  0% {
    top: 0;
  }
  50% {
    top: 30px;
  }
  100% {
    top: 0;
  }
}

@keyframes bannarRotate {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

#home-main {
  // position: relative;
  .home-main-container {
    position: relative;
    width: 100%;
    height: 100vh;
    // overflow: auto;
    .bannar-container {
      position: relative;
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .home-header {
        width: 100%;
        display: flex;
        flex-direction: column;
        .el-carousel {
          width: 100%;
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
    }
    .bannar-container:nth-child(4) {
      h2 {
        letter-spacing: 1px;
        margin-bottom: 10px;
        font-weight: 500;
      }
    }
    .bannar-container:nth-child(5) {
      h2 {
        letter-spacing: 1px;
        font-weight: 500;
        color: rgb(138, 138, 138);
        .icon-wenhao {
          font-size: 30px;
        }
      }
    }
    .bannar-container:nth-child(6) {
      h2 {
        width: 100%;
        position: relative;
        color: #fff;
      }
      h2::after {
        content: '你不知道的宠物百科都在这';
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        color: transparent;
        background-image: linear-gradient(to right,
        #c23616,#192a56,#00d2d3,yellow,
        #6d214f,#2e86de,#4cd137,#e84118);
        background-clip: text;
        -webkit-background-clip: text;
        // clip-path: circle(100px at 0% 50%);
      }
    }
  }
}

.jump-to-next {
  width: 100%;
  text-align: center;
  position: relative;
  margin-top: 10px;
  .icon-xiajiang {
    position: absolute;
    font-size: 30px;
    color: rgba(0, 0, 0, 0.3);
    animation: jumpStyle 2s ease-in-out 0s infinite;
  }
}

.jump-to-top {
  width: 100%;
  text-align: center;
  position: relative;
  margin-top: 10px;
  .icon-shangsheng1 {
    position: absolute;
    font-size: 30px;
    color: rgba(0, 0, 0, 0.3);
    animation: jumpStyle 2s ease-in-out 0s infinite;
  }
}

.pets-home-container {
  position: relative;
  width: 100%;
  background-color: rgba(51, 110, 112, 0.9);
  h2 {
    letter-spacing: 1px;
    position: absolute;
    top: 50px;
    width: 100%;
    text-align: center;
    color: #fff;
  }
  .pets-home {
    width: 100%;
    height: 75vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .video-list {
      .video-item {
        padding: 5px 5px 8px;
        background-color: #fff;
        #pets-home-video {
          background-color: rgba(51, 110, 112, 0.9);
          width: 30vw;
          height: 280px;
        }
      }
    }
  }
}

.pets-community {
  // position: relative;
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(#333,0.5);
  perspective: 900px;
  overflow: hidden;
  .pets-community-container {
    position: relative;
    width: 300px;
    height: 200px;
    cursor: pointer;
    transform-style: preserve-3d;
    animation: bannarRotate 20s linear infinite;
    .pets-community-card {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      -webkit-box-reflect: below 5px
      -webkit-linear-gradient(transparent 10%, rgba(255,255,255,0.3));
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .pets-community-card:nth-child(1) {
      transform: translateZ(300px);
      background-color: #c14c39;
    }
    .pets-community-card:nth-child(2) {
      transform: rotateY(60deg) translateZ(300px);
      background-color: #6e9c72;
    }
    .pets-community-card:nth-child(3) {
      transform: rotateY(120deg) translateZ(300px);
      background-color: #5e5f7a;
    }
    .pets-community-card:nth-child(4) {
      transform: rotateY(180deg) translateZ(300px);
      background-color: #f5eb98;
    }
    .pets-community-card:nth-child(5) {
      transform: rotateY(240deg) translateZ(300px);
      background-color: #50a3bc;
    }
    .pets-community-card:nth-child(6) {
      transform: rotateY(300deg) translateZ(300px);
      background-color: #f9a99a;
    }
  }
  .pets-community-container:hover {
    animation-play-state: paused;
  }
}

.pets-store {
  margin: 20px 0;
  position: relative;
  display: flex;
  .pets-store-card {
    margin-left: 45px;
    position: relative;
    width: 320px;
    height: 450px;
    background-color: #e7eed8;
    border-radius: 20px;
    overflow: hidden;
    transition: 0.5s ease-in-out;
    .img-box {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 999;
      height: 220px;
      width: 100%;
      transition: 0.5s;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 270px;
      }
    }
    .content-box {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 100px;
      text-align: center;
      transition: 1s;
      z-index: 0;
      .goods-name {
        position: relative;
        letter-spacing: 1px;
        color: goldenrod;
        transition: 0.5s;
        opacity: 0;
        visibility: hidden;
      }
      .goods-price {
        margin-top: 10px;
        color: lightcoral;
        transition: 0.5s;
        opacity: 0;
        visibility: hidden;
      }
      .add-cart-btn {
        font-weight: 700;
        background-color: #fff;
        border-radius: 5px;
        width: 100px;
        padding: 5px 10px;
        color: lightseagreen;
        cursor: pointer;
        margin: 10px auto 0;
        opacity: 0;
        transform: translateY(50px);
        transition: 0.5s;
      }
    }
  }
  .pets-store-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: lightpink;
    clip-path: circle(150px at 80% 20%);
  }
  .pets-store-card:hover::before {
    clip-path: circle(300px at 80% -20%);
  }
  .pets-store-card:hover .img-box {
    top: 0;
    transform: translateY(0);
  }
  .pets-store-card:hover .content-box {
    height: 210px;
  }
  .pets-store-card:hover .content-box .goods-name,
  .pets-store-card:hover .content-box .goods-price {
    opacity: 1;
    transition-delay: 0.2s;
    visibility: visible;
  }
  .pets-store-card:hover .content-box .add-cart-btn {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.5s;
  }
}

.pets-wiki {
  margin: 0 auto;
  position: relative;
  width: 1000px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px,1fr));
  .pets-wiki-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .img-wiki-box {
      position: relative;
      width: 250px;
      height: 250px;
      background-color: #000;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .content-wiki-box {
      position: relative;
      width: 250px;
      height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        padding: 20px;
        text-align: center;
        p:nth-of-type(1) {
          font-size: 18px;
        }
        p:nth-of-type(3) {
          line-height: 24px;
          height: 144px;
          overflow: hidden;
        }
      }
    }
  }
  .pets-wiki-card:nth-child(even) {
    flex-direction: column-reverse;
  }
}

@media (max-width: 1000px) {
  .pets-wiki {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
    margin: 50px;
    .pets-wiki-card {
      flex-direction: row;
      margin: 10px 0;
      .img-wiki-box,
      .content-wiki-box {
        width: 50%;
      }
    }
    .pets-wiki-card:nth-child(even) {
      flex-direction: row-reverse;
    }
  }
}

@media (max-width: 600px) {
  .pets-wiki {
    .pets-wiki-card {
      flex-direction: column;
      margin: 10px 0;
      .img-wiki-box,
      .content-wiki-box {
        width: 100%;
      }
    }
    .pets-wiki-card:nth-child(even) {
      flex-direction: column;
    }
  }
}
</style>
