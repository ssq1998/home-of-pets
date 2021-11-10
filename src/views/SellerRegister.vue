<template>
  <div id="seller-register">
    <h1>欢迎注册成为卖家</h1>
    <div class="register-box">
      <div class="register-left">
        <span>给你的店铺取个名字吧</span>
        <span>经营地址</span>
        <span>上传店铺图标</span>
      </div>
      <div class="register-right">
        <input type="text" v-model="storeName" />
        <input type="text" v-model="storeAddress" placeholder="请输入店铺所有者的所在地地址" />
        <el-upload
          drag
          action
          :auto-upload="false"
          :on-change="uploadPicFile"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          multiple
          :file-list="fileList"
          list-type="picture"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
          将文件拖到此处,或
          <em>点击上传</em>
          </div>
        </el-upload>
      </div>
    </div>
    <h2>实名认证</h2>
    <div class="userInfo-box">
      <div class="userInfo-left">
        <span>真实姓名</span>
        <span>身份证号</span>
      </div>
      <div class="userInfo-right">
        <input type="text" v-model="name" placeholder="请输入您的真实姓名" />
        <input type="text" v-model="cardNumber" placeholder="请输入您的身份证号码">
      </div>
    </div>
    <div class="register-btn" @click="submitRegisterInfo">提交注册信息</div>
  </div>
</template>

<script>
import axios from 'axios'
import axiosObj from '@/api/axios'
import { fileParse } from '../config/uploadfile'
import qs from 'qs'

export default {
  data() {
    return {
      storeName: '',
      fileList: [],
      uploadImg: [],
      storeAddress: '',
      name: '',
      cardNumber: ''
    }
  },
  methods: {
    async uploadPicFile(file) {
      if (!file) return
      file = file.raw
      // 格式校验
      const { type, size } = file
      // if (!/{png|gif|jpeg|jpg|webp}/i.test(type)) {
      //   this.$message({
      //     type: 'error',
      //     message: '无法上传该文件格式'
      //   })
      //   return false
      // }
      if (size > 200 * 1024 * 1024) {
        this.$message({
          type: 'warning',
          message: '文件体积过大，请上传小于200MB的文件'
        })
        return false
      }
      // 将上传的文件进行编码(FileReader)
      // 将其转换为base64编码格式
      // 使用axios发送请求，传递信息到服务器
      let result = await fileParse(file, 'base64')
      result = await axios.post('/upload/uploadPic',
        qs.stringify({
          chunk: encodeURIComponent(result),
          filename: file.name
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      result = result.data
      if (result.code === 0) {
        console.log(result.path)
        this.uploadImg.push(result)
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      const len = this.uploadImg.length
      for (let i = 0; i < len;) {
        if (this.uploadImg[i] === null) {
          i++
          break
        }
        if (this.uploadImg[i].originalFilename === file.name) {
          this.uploadImg[i] = null
          return
        }
      }
    },
    async submitRegisterInfo() {
      const storeNameValidate = /^.{1,20}$/.test(this.storeName)
      const storeAddressValidate = /^.{1,}$/.test(this.storeAddress)
      const nameValidate = /^[\u4e00-\u9fa5]{2,}$/.test(this.name)
      const cardNumberValidate = /^\d{8,18}|[0-9x]{8,18}|[0-9X]{8,18}?$/.test(this.cardNumber)
      if (!storeNameValidate) {
        this.$message({
          type: 'warning',
          message: '名字长度在1到20个字符'
        })
        return
      }
      if (!storeAddressValidate) {
        this.$message({
          type: 'warning',
          message: '请输入经营地址'
        })
        return
      }
      if (!nameValidate) {
        this.$message({
          type: 'warning',
          message: '请输入正确的名字'
        })
        return
      }
      if (!cardNumberValidate) {
        this.$$message({
          type: 'warning',
          message: '请输入正确的身份证号码'
        })
        return
      }
      const newUploadImg = []
      this.uploadImg.forEach((item,i,arr) => {
        if (item) {
          newUploadImg.push(item)
        }
      })
      const dataObj = {
        userID: this.$store.state.userInfo.userInfo._id,
        storeName: this.storeName,
        storeMark: newUploadImg,
        storeOwner: this.name,
        storeOwnerCardID: this.cardNumber,
        registerDate: new Date(),
        storeAddress: this.storeAddress
      }
      await axiosObj.request({
        url: 'store/registerStore',
        method: 'post',
        data: dataObj
      }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '提交成功，等待管理员审核'
        })
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
#seller-register {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    margin: 60px 0px 20px;
  }
  h2 {
    margin: 20px 0;
  }
  .register-box {
    display: flex;
    .register-left {
      width: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 20vh;
      span {
        font-weight: 700;
      }
    }
    .register-right {
      display: flex;
      flex-direction: column;
      input {
        width: 440px;
        padding: 7px 10px;
        outline: none;
        border-radius: 20px;
        border: none;
        line-height: 20px;
        letter-spacing: 1px;
      }
      input:nth-of-type(2) {
        margin: 25px 0;
      }
    }
  }
  .userInfo-box {
    display: flex;
    .userInfo-left {
      width: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 12vh;
      span {
        font-weight: 700;
      }
      span:nth-of-type(2) {
        margin-bottom: 8px;
      }
    }
    .userInfo-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 12vh;
      input {
        width: 440px;
        padding: 7px 10px;
        outline: none;
        border-radius: 20px;
        border: none;
        line-height: 20px;
        letter-spacing: 1px;
      }
    }
  }
  .register-btn {
    margin-top: 20px;
    width: 200px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
    color: white;
    background-color: rgb(75, 114, 185);
    cursor: pointer;
    transform: 0.2s;
  }
  .register-btn:hover {
    background-color: rgba(75, 114, 185, 0.5);
  }
}
</style>
