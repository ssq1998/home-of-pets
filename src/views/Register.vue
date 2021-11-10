<template>
  <div id="register-container">
    <div class="register-pic-box">
      <img src="../assets/kejizhuce.jpeg">
    </div>
    <div class="register-content-box">
      <div class="register-form-box">
        <h2>用户注册</h2>
        <form>
          <div class="input-box">
            <span>用户名</span>
            <input type="text" v-model="ruleForm.username">
          </div>
          <div class="input-box">
            <span>密码</span>
            <input type="password" v-model="ruleForm.password">
          </div>
          <div class="input-box">
            <span>手机号码</span>
            <input type="text" v-model="ruleForm.phoneNumber">
          </div>
          <div class="submit-btn" @click="submitForm">注册</div>
          <div class="to-login">已有账号,<router-link to="/login">返回登录</router-link></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  data() {
    return {
      ruleForm: {
        username: '',
        password: '',
        phoneNumber: ''
      }
    }
  },
  methods: {
    async submitForm() {
      const usernameValidate = /^[a-zA-Z][a-zA-Z0-9_]{5,9}$/.test(this.ruleForm.username)
      const passwordValidate = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(this.ruleForm.password)
      const phoneNumberValidate = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(this.ruleForm.phoneNumber)
      if (!usernameValidate) {
        this.$message({
          type: 'warning',
          message: '用户名必须以字母开头,长度在6到10个字符,允许有下划线'
        })
        return
      }
      if (!passwordValidate) {
        this.$message({
          type: 'warning',
          message: '密码必须是包含大小写字母和数字的组合,长度在8到16个字符,不能使用特殊字符,如?=.*等'
        })
        return
      }
      if (!phoneNumberValidate) {
        this.$message({
          type: 'warning',
          message: '手机号码格式不正确'
        })
        return
      }
      await axios.request({
        url: '/user/register',
        method: 'post',
        data: this.ruleForm
      }).then(async(res) => {
        await axios.request({
          url: 'cart/createCart',
          method: 'post',
          data: {
            userID: res.data._id
          }
        })
        this.$message({
          type: 'success',
          message: '注册成功'
        })
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
#register-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  .register-pic-box:before {
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
  .register-pic-box {
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
  .register-content-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 100%;
    .register-form-box {
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
        .to-login {
          color: #607d8b;
          a {
            color: #ff4584;
          }
        }
      }
    }
  }
}

@media (max-width:768px) {
  #register-container {
    .register-pic-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .register-content-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      z-index: 1;
      .register-form-box {
        width: 100%;
        padding: 40px;
        background-color: rgba(255,255,255,0.7);
        margin: 50px;
      }
    }
  }
}
</style>
