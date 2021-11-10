<template>
  <div id="login-container">
    <div class="slide-box" v-if="showSlideVerify">
      <slide-verify
        :l="42"
        :r="10"
        :w="310"
        :h="155"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
        :slider-text="text"
      ></slide-verify>
      <div class="slide-tip">{{msg}}</div>
    </div>
    <div class="login-pic-box">
      <img src="../assets/kejizhuce.jpeg">
    </div>
    <div class="login-content-box">
      <div class="login-form-box">
        <h2>用户登录</h2>
        <form>
          <div class="input-box">
            <span>用户名</span>
            <input type="text" v-model="ruleForm.username">
          </div>
          <div class="input-box">
            <span>密码</span>
            <input type="password" v-model="ruleForm.password">
          </div>
          <div class="submit-btn"  @click="submitForm">登录</div>
          <div class="to-register">没有账号?<router-link to="/register">去注册</router-link></div>
        </form>
        <!-- <h3>第三方登录</h3>
        <ul class="third-party-login">
          <li><i class="iconfont icon-QQ"></i></li>
          <li><i class="iconfont icon-weixin"></i></li>
          <li><i class="iconfont icon-weibo"></i></li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
import { getLoginUserInfo } from '@/api/user'

export default {
  data() {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      text: '拖动左方滑块向右滑动',
      showSlideVerify: false,
      msg: ''
    }
  },
  methods: {
    async submitForm() {
      if (this.ruleForm.username !== '' && this.ruleForm.password !== '') {
        this.showSlideVerify = true
      } else {
        this.$message({
          type: 'warning',
          message: '请输入用户名和密码'
        })
      }
    },
    async onSuccess() {
      await axios.request({
        url: '/user/login',
        method: 'post',
        data: this.ruleForm
      }).then(async(res) => {
        localStorage.setItem('elementToken', 'Bearer ' + res.data)
        if (localStorage.elementToken) {
          await getLoginUserInfo().then(async(result) => {
            this.$store.dispatch('userInfo/setUserInfo', result.data)
            this.$store.commit('userInfo/setIsLogin', true)
          })
          this.$message({
            type: 'success',
            message: '登录成功'
          })
          this.$router.push('/home')
        }
      }).catch((err) => {
        if (err.status !== 200) {
          this.showSlideVerify = false
        }
      })
    },
    onFail() {
      this.msg = '再试一次吧'
      setTimeout(() => {
        this.msg = ''
      },3000)
    },
    onRefresh() {
      this.msg = '再试一次吧'
      setTimeout(() => {
        this.msg = ''
      },3000)
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  .slide-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    background-color: rgba(#000,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .slide-tip {
      font-size: 20px;
      color: red;
    }
  }
  .login-pic-box:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(225deg,#e91e63,#03a9f4);
    z-index: 1;
    mix-blend-mode: screen;
  }
  .login-pic-box {
    position: relative;
    width: 50%;
    height: 100%;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .login-content-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100%;
    .login-form-box {
      width: 50%;
      h2 {
        color: #607d8b;
        font-weight: 600;
        margin-bottom: 20px;
        border-bottom: 4px solid #ff4584;
        display: inline-block;
        letter-spacing: 1px;
      }
      form {
        color: #607d8b;
        letter-spacing: 1px;
        .input-box {
          margin-bottom: 20px;
          span {
            display: inline-block;
            margin-bottom: 10px;
          }
          input {
            width: 100%;
            padding: 10px 20px;
            font-weight: 400;
            font-size: 16px;
            outline: none;
            border: 1px solid #607d8b;
            letter-spacing: 1px;
            color: #607d8b;
            background-color: transparent;
            border-radius: 30px;
          }
        }
        .submit-btn {
          width: 100%;
          text-align: center;
          padding: 10px;
          border-radius: 30px;
          background-color: #ff4584;
          border: none;
          letter-spacing: 1px;
          color: #fff;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .submit-btn:hover {
          background-color: rgba(#ff4584,0.7);
        }
        .to-register {
          color: #607d8b;
          a {
            color: #ff4584;
          }
        }
      }
      h3 {
        color: #607d8b;
        text-align: center;
        margin: 40px 0 10px;
      }
      .third-party-login {
        display: flex;
        justify-content: center;
        align-items: center;
        li {
          list-style: none;
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #607d8b;
          border-radius: 50%;
          margin: 0 7px;
          cursor: pointer;
        }
        li:hover {
          background-color: #ff4584;
        }
        li:hover i {
          color: #fff;
        }
      }
    }
  }
}

@media (max-width:768px) {
  #login-container {
    .login-pic-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .login-content-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      z-index: 1;
      .login-form-box {
        width: 100%;
        padding: 40px;
        background-color: rgba(255,255,255,0.7);
        margin: 50px;
      }
    }
  }
}
</style>
