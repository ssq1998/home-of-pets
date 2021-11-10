<template>
  <div id="personal-center">
    <div class="personal-inner-header">
      <div class="personal-header-info">
        <img v-lazy="user.userPhoto" />
        <div class="user-info-content">
          <h2>{{user.username}}</h2>
          <p class="el-icon-user-solid">
            <span class="signature">{{user.signature}}</span>
          </p>
          <router-link to="/editprofile">
            <p class="editInfo-btn">编辑</p>
          </router-link>
        </div>
      </div>
      <div class="personal-header-data">
        <div>
          <p>{{article.length}}</p>
          <p><router-link to="/mypublish">我的发布</router-link></p>
        </div>
        <div>
          <p>{{user.myCollectionList.length}}</p>
          <p><router-link to="/mycollection">我的收藏</router-link></p>
        </div>
        <div>
          <p>{{user.myAttentionList.length}}</p>
          <p><router-link to="/myfollow">我的关注</router-link></p>
        </div>
      </div>
    </div>
    <div class="personal-inner-main">
      <div class="personal-main-aside">
        <div class="personal-aside-title">个人中心</div>
        <div class="personal-aside-content">
          <router-link to="/editprofile">
            <span class="icon-style el-icon-edit-outline">
              编辑资料
            </span>
          </router-link>
          <router-link to="/mypublish">
            <span class="icon-style el-icon-edit">
              我的发布
            </span>
          </router-link>
          <router-link to="/mycollection">
            <span class="icon-style el-icon-star-off">
              我的收藏
            </span>
          </router-link>
          <router-link to="/myfollow">
            <span class="icon-style iconfont icon-icon">
              我的关注
            </span>
          </router-link>
          <router-link to='/sellercenter' v-if="this.$store.state.userInfo.userInfo.isSeller === true">
            <span class="icon-style iconfont icon-maijia">&nbsp;卖家中心</span>
          </router-link>
          <router-link to='/waitorder' v-if="this.$store.state.userInfo.userInfo.isSeller === true">
            <span class="icon-style iconfont icon-maijia">&nbsp;等待发货</span>
          </router-link>
        </div>
      </div>
      <div class="personal-main-content">
        <router-view></router-view>
      </div>
    </div>
    <footer-com></footer-com>
  </div>
</template>

<script>
import axios from '@/api/axios'
import FooterCom from '../components/FooterCom.vue'

export default {
  components: { FooterCom },
  data() {
    return {
      article: []
    }
  },
  computed: {
    user() {
      return this.$store.state.userInfo.userInfo
    }
  },
  async created() {
    const res = await axios.request({
      url: 'article/getUserAllArticle',
      method: 'post',
      data: {
        userID: this.user._id
      }
    })
    this.article = res.data
  }
}
</script>

<style lang="less" scoped>
#personal-center {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .personal-inner-header {
    margin: 70px 250px 30px;
    background-color: rgba(#fff, 0.3);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    .personal-header-info {
      width: 50%;
      display: flex;
      justify-content: space-evenly;
      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
      .user-info-content {
        display: flex;
        flex-direction: column;
        width: 300px;
        padding: 0 20px;
        h2 {
          padding: 5px 0;
          font-weight: 500;
          color: #333;
        }
        .el-icon-user-solid {
          color: #999;
          padding: 5px 0;
          .signature {
            color: #999;
            margin-left: 10px;
          }
        }
        .editInfo-btn {
          margin: 15px 0;
          width: 80px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          color: rgb(105, 134, 230);
          border: 1px solid rgb(105, 134, 230);
          cursor: pointer;
          transition: 0.2s;
        }
        .editInfo-btn:hover {
          color: rgba(105, 134, 230, 0.5);
          border: 1px solid rgba(105, 134, 230, 0.5);
        }
      }
    }
    .personal-header-data {
      width: 50%;
      display: flex;
      justify-content: space-evenly;
      font-size: 18px;
      div {
        width: 100px;
        height: 100px;
        text-align: center;
        p {
          padding: 10px 0 0;
        }
      }
    }
  }
  .personal-inner-main {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    .personal-main-aside {
      width: 240px;
      max-height: 440px;
      background-color: rgba(#fff,0.3);
      border-radius: 4px;
      .personal-aside-title {
        border-bottom: 1px solid #c2bebe;
        padding: 10px 0px 10px 30px;
        font-size: 18px;
        font-weight: 400;
      }
      .personal-aside-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        a {
          margin: 20px 0;
          transition: 0.2s;
          .icon-style {
            font-size: 18px;
          }
        }
        a:hover {
          color: rgb(61, 176, 214);
        }
      }
    }
    .personal-main-content {
      margin-left: 30px;
    }
  }
}
</style>
