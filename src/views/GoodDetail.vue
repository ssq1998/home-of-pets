<template>
  <div id="good-detail">
    <div class="header-container">
      <p>{{headerTitle}}</p>
      <p v-if="!showModify" @click="changeModify">返回详情页</p>
    </div>
    <div class="goodInfo-box" v-if="isModify">
      <div class="good-img-box" v-for="(item, index) in goodInfo.goodPic" :key="index">
        <el-image
          :src="item.path"
          :preview-src-list="imgList"
          lazy>
        </el-image>
      </div>
      <ul v-if="showModify" class="after-modify" @click="changeModify">
        <li class="goods-name">商品名:&nbsp;{{goodInfo.goodName}}</li>
        <li class="goods-price">商品价格:&nbsp;<span>￥{{goodInfo.beforeDiscount}}</span>/￥{{goodInfo.afterDiscount}}</li>
        <li>商品分类:&nbsp;{{goodInfo.classification}}</li>
        <li><i class="iconfont icon-xiugai"></i>&nbsp;修改</li>
      </ul>
      <ul v-else class="modifying">
        <li>
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
            将商品图片拖到此处,或
            <em>点击上传</em>
            </div>
          </el-upload>
        </li>
        <li>商品名:&nbsp;<input v-model="goodInfo.goodName" /></li>
        <li>优惠前商品价格:&nbsp;<input v-model="goodInfo.beforeDiscount" /></li>
        <li>优惠后商品价格:&nbsp;<input v-model="goodInfo.afterDiscount" /></li>
        <li>商品分类:
          <el-radio-group v-model="goodInfo.classification">
            <el-radio :label="'clothes'">服饰装扮</el-radio>
            <el-radio :label="'food'">营养食品</el-radio>
            <el-radio :label="'living'">爱心家居</el-radio>
            <el-radio :label="'travel'">呵护出行</el-radio>
          </el-radio-group>
        </li>
        <li>
          <p @click="updateGood">确认修改</p>
          <p @click="changeModify">返回</p>
        </li>
      </ul>
      <p>上架时间:{{goodInfo.putDate | fixedDate}}</p>
    </div>
    <ul class="put-good" v-else>
      <li>
        <el-upload
          drag
          action
          :auto-upload="false"
          :on-change="uploadPicFilePut"
          :on-preview="handlePreview"
          :on-remove="handleRemovePut"
          multiple
          :file-list="fileList"
          list-type="picture"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
          将商品图片拖到此处,或
          <em>点击上传</em>
          </div>
        </el-upload>
      </li>
      <li>商品名:&nbsp;<input v-model="goodName" /></li>
      <li>优惠前商品价格:&nbsp;<input v-model="beforeDiscount" /></li>
      <li>优惠后商品价格:&nbsp;<input v-model="afterDiscount" /></li>
      <li>商品分类:
        <el-radio-group v-model="classification">
          <el-radio :label="'clothes'">服饰装扮</el-radio>
          <el-radio :label="'food'">营养食品</el-radio>
          <el-radio :label="'living'">爱心家居</el-radio>
          <el-radio :label="'travel'">呵护出行</el-radio>
        </el-radio-group>
      </li>
      <li @click="putGood">上架商品</li>
    </ul>
  </div>
</template>

<script>
import moment from 'moment'
import { fileParse } from '../config/uploadfile'
import axios from 'axios'
import qs from 'qs'
import axiosObj from '@/api/axios'

export default {
  data() {
    return {
      goodInfo: {},
      imgList: [],
      showModify: true,
      fileList: [],
      uploadImg: [],
      goodName: '',
      beforeDiscount: 0,
      afterDiscount: 0,
      classification: 'clothes',
      storeInfo: {}
    }
  },
  async created() {
    const store = await axiosObj.request({
      url: 'store/getStoreInfo',
      method: 'post',
      data: {
        userID: this.$store.state.userInfo.userInfo._id
      }
    })
    this.storeInfo = store.data[0]
    if (this.isModify) {
      this.goodInfo = this.$route.params.good
      this.goodInfo.goodPic.forEach((item,i,arr) => {
        this.imgList.push(item.path)
      })
    }
  },
  methods: {
    async updateGood() {
      const res = await axiosObj.request({
        url: 'good/updateGood',
        method: 'post',
        data: {
          goodInfo: this.goodInfo
        }
      })
      this.goodInfo = res.data[0]
      this.goodInfo.goodPic.forEach((item,i,arr) => {
        this.imgList.push(item.path)
      })
      this.$message({
        type: 'success',
        message: '修改成功'
      })
    },
    changeModify() {
      this.showModify = !this.showModify
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      const len = this.goodInfo.goodPic.length
      for (let i = 0; i < len;) {
        if (this.goodInfo.goodPic[i] === null) {
          i++
          break
        }
        if (this.goodInfo.goodPic[i].originalFilename === file.name) {
          this.goodInfo.goodPic[i] = null
          return
        }
      }
    },
    handleRemovePut(file, fileList) {
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
        this.goodInfo.goodPic.push(result)
      }
    },
    async uploadPicFilePut(file) {
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
    async putGood() {
      if (!this.uploadImg.length) {
        return this.$message({
          type: 'warning',
          message: '请上传商品图片'
        })
      }
      if (this.goodName === '') {
        return this.$message({
          type: 'warning',
          message: '商品名不能为空'
        })
      }
      await axiosObj.request({
        url: 'good/putGood',
        method: 'post',
        data: {
          goodName: this.goodName,
          beforeDiscount: this.beforeDiscount,
          afterDiscount: this.afterDiscount,
          goodPic: this.uploadImg,
          classification: this.classification,
          storeID: this.storeInfo._id
        }
      })
      this.$message({
        type: 'success',
        message: '上架成功'
      })
      this.$router.push('/sellercenter')
    }
  },
  computed: {
    headerTitle() {
      const arr = Object.keys(this.$route.params.good)
      return arr.length !== 0 ? '修改商品信息' : '上架商品'
    },
    isModify() {
      const arr = Object.keys(this.$route.params.good)
      return arr.length
    }
  },
  filters: {
    fixedDate(date) {
      moment.locale('zh-cn')
      return moment(date).format('lll')
    }
  }
}
</script>

<style lang="less" scoped>
#good-detail {
  background-color: rgba(#fff, 0.5);
  border-radius: 4px;
  width: 750px;
  .header-container {
    padding: 10px 25px;
    border-bottom: 1px solid #c2bebe;
    display: flex;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
    p:nth-of-type(2) {
      cursor: pointer;
    }
  }
  .goodInfo-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .good-img-box {
      width: calc(calc(100% / 3) - 10px);
      margin:5px;
      height:250px;
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
    .after-modify {
      list-style: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      li {
        font-size: 18px;
        margin: 5px 0;
      }
      li:last-of-type {
        color: rgb(45, 123, 197);
        cursor: pointer;
        transition: 0.2;
      }
      li:last-of-type:hover {
        color: rgba(45, 123, 197, 0.5);
      }
      .goods-price {
        span {
          text-decoration: line-through;
        }
      }
    }
    .modifying {
      list-style: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      li {
        font-size: 18px;
        margin: 5px 0;
        input {
          outline: none;
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid rgba(45, 123, 197, 0.5);
        }
      }
      li:nth-of-type(2) input {
        width: 240px;
      }
      li:last-of-type {
        display: flex;
        p {
          color: #fff;
          cursor: pointer;
          transition: 0.2;
          background-color: rgb(77, 159, 236);
          padding: 3px 0;
          width: 100px;
          text-align: center;
          margin-left: 10px;
        }
      }
      li:last-of-type p:hover {
        background-color: rgba(77, 159, 236, 0.7);
      }
    }
    p {
      font-size: 18px;
      margin: 5px 0;
    }
  }
  .put-good {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    list-style: none;
    li {
      font-size: 18px;
      margin: 5px 0;
      input {
        outline: none;
        padding: 5px 10px;
        border: 1px solid rgba(45, 123, 197, 0.5);
        border-radius: 4px;
      }
    }
    li:nth-of-type(2) input {
      width: 240px;
    }
    li:last-of-type {
      color: white;
      cursor: pointer;
      transition: 0.2;
      background-color: rgb(77, 159, 236);
      padding: 3px 5px;
    }
    li:last-of-type:hover {
      background-color: rgba(77, 159, 236, 0.7);
    }
  }
}
</style>
