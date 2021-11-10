<template>
  <div id="header-com">
    <h2 class="web-name">宠物之家</h2>
    <div class="nav-container">
      <div class="dropdown">
        <span><router-link to="/home">首页</router-link></span>
      </div>
      <div class="dropdown">
        <span>网站导航</span>
        <div class="dropdown-nav-content">
          <div><router-link to="/petshome">宠物之家</router-link></div>
          <div><router-link to="/petscommunity">宠物社区</router-link></div>
          <div><router-link to="/petsstore">宠物商店</router-link></div>
          <div><router-link to="/petswiki">宠物百科</router-link></div>
        </div>
      </div>
      <div class="dropdown">
        <span><router-link to="/personalcenter">个人中心</router-link></span>
      </div>
      <div class="dropdown">
        <span>订单管理</span>
        <div class="dropdown-order-content">
          <div><router-link to="/petscart">购物车</router-link></div>
          <div><router-link to="/manageorder">订单查询</router-link></div>
        </div>
      </div>
      <div class="dropdown" v-if="this.$store.state.userInfo.userInfo.isAdmin === true">
        <span><router-link to="/adminiinterface">管理员后台</router-link></span>
      </div>
    </div>
    <div class="become-seller" v-if="isSeller === false && isAdmin === false"><router-link to="/sellerregister">成为卖家</router-link></div>
    <div class="tip">
      <div class="welcome-tip" v-if="isLogin">
        欢迎,{{ this.$store.state.userInfo.userInfo.username }}<span v-if="isAdmin">[管理员]</span><span v-if="isSeller">[卖家]</span>
      </div>
      <div v-else>
        <router-link to="/login" class="login-tip">登录</router-link>
        <router-link to="/register" class="register-tip">注册</router-link>
      </div>
      <div class="logout-btn" @click="logout" v-if="isLogin"><i class="iconfont icon-tuichu"></i></div>
    </div>
  </div>
</template>

<script>
import { getLoginUserInfo } from '@/api/user'
import axios from '@/api/axios'

export default {
  name: 'header-com',
  data() {
    return {
    }
  },
  async created() {
    if (localStorage.elementToken) {
      await getLoginUserInfo().then(async(res) => {
        this.$store.dispatch('userInfo/setUserInfo', res.data)
        this.$store.commit('userInfo/setIsLogin', true)
        if (res.data.isSeller === true) {
          await axios.request({
            url: 'store/getStoreInfo',
            method: 'post',
            data: {
              username: this.$store.state.userInfo.userInfo.username
            }
          }).then((res) => {
            this.$store.dispatch('storeInfo/setStoreInfo', res.data[0])
          })
        }
      })
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.userInfo.isLogin
    },
    isSeller() {
      return this.$store.state.userInfo.userInfo.isSeller
    },
    isAdmin() {
      return this.$store.state.userInfo.userInfo.isAdmin
    }
  },
  methods: {
    logout() {
      this.$store.commit('userInfo/setIsLogin', false)
      this.$router.push('/login')
      window.localStorage.clear()
    }
  }
}
</script>

<style lang="less" scoped>
#header-com {
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 60px;
  padding: 0 60px;
  z-index: 1000;
  .web-name {
    font-weight: 600;
    color: rgba(#fff, 0.7);
  }
  .nav-container {
    width: 500px;
    display: flex;
    .dropdown {
      color: #fff;
      text-align: center;
      width: 100px;
      line-height: 60px;
      cursor: pointer;
      position: relative;
      transition: 0.5s;
      a {
        color: #fff;
      }
      .dropdown-nav-content {
        opacity: 0;
        visibility: hidden;
        overflow: hidden;
        width: 100px;
        height: 0;
        position: fixed;
        background-color: rgba(lightblue, 0.7);
        padding: 0px 8px;
        transition: 0.5s;
        div:hover a {
          color: lightsalmon;
        }
      }
      .dropdown-order-content {
        opacity: 0;
        visibility: hidden;
        overflow: hidden;
        width: 100px;
        height: 0;
        position: fixed;
        background-color: rgba(lightblue, 0.7);
        padding: 0px 8px;
        transition: 0.5s;
        div:hover a {
          color: lightsalmon;
        }
      }
    }
    .dropdown:hover span {
      color: lightsalmon;
    }
    .dropdown:hover span a {
      color: lightsalmon;
    }
    .dropdown:hover .dropdown-nav-content {
      opacity: 1;
      visibility: visible;
      display: block;
      height: 240px;
    }

    .dropdown:hover .dropdown-order-content {
      opacity: 1;
      visibility: visible;
      display: block;
      height: 120px;
    }
  }
  .become-seller {
    padding: 3px 10px;
    border: 1px solid rgba(#fff, 0.7);
    border-radius: 30px;
    a {
      color: rgba(#fff, 0.7);
    }
  }
  .tip {
    padding: 0 15px;
    color: rgba(#fff, 0.7);
    display: flex;
    .welcome-tip {
      margin-right: 20px;
    }
    .login-tip, .register-tip {
      display: inline-block;
      padding: 3px 10px;
      border: 1px solid rgba(#fff, 0.7);
      border-radius: 30px;
      color: rgba(#fff, 0.7);
      cursor: pointer;
      transition: 0.5s;
      margin-right: 10px;
    }
    .register-tip:hover,
    .login-tip:hover {
      color: lightcoral;
      border: 1px solid rgba(lightcoral, 0.7);
    }
    .logout-btn {
      color: rgba(#fff, 0.7);
      cursor: pointer;
    }
    .logout-btn:hover {
      color: lightcoral;
    }
  }
}

@media (max-width: 800px) {
  #header-com {
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
    .web-name {
      width: 100%;
      text-align: center;
      height: 60px;
      line-height: 60px;
    }
    .nav-container {
      width: 100%;
      flex-direction: column;
      .dropdown {
        width: 100%;
        .dropdown-nav-content {
          background-color: rgba(#fff, 0);
          position: relative;
          left: 50%;
          transform: translateX(-50%);
        }
        .dropdown-order-content {
          background-color: rgba(#fff, 0);
          position: relative;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    .tip {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
