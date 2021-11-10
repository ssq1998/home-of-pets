<template>
    <div id="public-article">
      <div class="article-container">
          <h2 class="article-header">发布</h2>
          <div class="article-edit">
            <el-form :model="articleInfo" ref="ruleForm" :rules="articleRules" label-width="70px" :hide-required-asterisk="true">
              <el-form-item label="标题" prop="title">
                <el-input
                v-model="articleInfo.title"
                style="width: 600px"
                type="text"
                placeholder="请输入标题"
                maxlength="30"
                show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="文章描述" prop="describe">
                <el-input
                style="width: 800px"
                v-model="articleInfo.describe"
                type="textarea"
                placeholder="请输入文章描述"
                maxlength="300"
                show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <Editor style="width: 1000px" v-model="articleInfo.content">
                  <div>111</div>
                </Editor>
              </el-form-item>
              <el-form-item label="发布板块">
                <el-radio-group v-model="radio" disabled>
                  <el-radio :label="1">宠物之家</el-radio>
                  <el-radio :label="2">宠物社区</el-radio>
                  <el-radio :label="3">宠物百科</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="添加标签">
                <el-tag
                  effect="dark"
                  :key="tag"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">添加新标签</el-button>
              </el-form-item>
              <el-form-item label="上传文件">
                <div v-if="radio === 1">
                  <el-upload
                    drag
                    action
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="uploadVideoFile"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                    将视频文件拖到此处,或
                    <em>点击上传</em>
                    </div>
                  </el-upload>
                  <div class="upload-progress">
                      <span>上传进度: {{total | totalText}}%</span>
                      <el-link class="progress-handle-btn" type="primary" v-if="total>0 && total<100" @click="progressHandleBtn">{{progressBtn | progressBtnText}}</el-link>
                  </div>
                  <div class="show-upload-video" v-if="uploadVideo">
                    <div v-for="item in uploadVideo" :key="item">
                      <video width="400px" height="300px" :src="item" controls />
                    </div>
                  </div>
                </div>
                <div v-if="radio === 2">
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
                    将图片文件拖到此处,或
                    <em>点击上传</em>
                    </div>
                  </el-upload>
                </div>
                <div v-if="radio === 3">
                  <div class="upload">
                    <div class="upload-video">
                      <el-upload
                        drag
                        action
                        :auto-upload="false"
                        :show-file-list="false"
                        :on-change="uploadVideoFile"
                      >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                        将视频文件拖到此处,或
                        <em>点击上传</em>
                        </div>
                      </el-upload>
                      <div class="upload-progress">
                          <span>上传进度: {{total | totalText}}%</span>
                          <el-link class="progress-handle-btn" type="primary" v-if="total>0 && total<100" @click="progressHandleBtn">{{progressBtn | progressBtnText}}</el-link>
                      </div>
                      <div class="show-upload-video" v-if="uploadVideo">
                        <div v-for="item in uploadVideo" :key="item">
                          <video width="400px" height="300px" :src="item" controls />
                        </div>
                      </div>
                    </div>
                    <div class="upload-img">
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
                        将图片文件拖到此处,或
                        <em>点击上传</em>
                        </div>
                      </el-upload>
                      <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                      </el-dialog>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="publishArticle('ruleForm')">发布</el-button>
              </el-form-item>
            </el-form>
          </div>
      </div>
    </div>
</template>

<script>
import { fileParse } from '../config/uploadfile'
import axios from 'axios'
import qs from 'qs'
import SparkMD5 from 'spark-md5'
import Editor from '../components/editor/index'
import axiosObj from '@/api/axios'

export default {
  components: {
    Editor
  },
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      dialogImageUrl: '',
      dialogVisible: false,
      articleInfo: {
        title: '',
        aid: 0,
        describe: '',
        content: ''
      },
      radio: 1,
      fileList: [],
      uploadImg: [],
      uploadVideo: [],
      total: 0,
      progressBtn: false,
      articleRules: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '文章描述不能为空', trigger: 'blur' },
          { max: 300, message: '描述最多不超过300个字符', trigger: 'change' }
        ],
        content: { required: true, message: '请输入文章内容', trigger: 'blur' }
      }
    }
  },
  created() {
    this.radio = this.$route.params.block
    this.articleInfo.aid = this.radio
  },
  filters: {
    progressBtnText(progressBtn) {
      return progressBtn ? '继续' : '暂停'
    },
    totalText(total) {
      return total > 100 ? 100 : total
    }
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
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
        // console.log(result.path)
        this.uploadImg.push(result)
      }
      // this.$message({
      //   type: 'success',
      //   message: '上传成功'
      // })
    },
    async uploadVideoFile(file) {
      if (!file) return
      file = file.raw
      const { type, size } = file
      console.log(type)
      const rightType = type === 'video/mp4' || type === 'video/ogg' || type === 'video/webm' || type === 'video/flv'
      if (!rightType) {
        this.$message({
          type: 'error',
          message: '无法上传该文件格式'
        })
        return false
      }
      if (size > 2 * 1024 * 1024 * 1024) {
        this.$message({
          type: 'warning',
          message: '文件体积过大，请上传小于2GB的文件'
        })
        return false
      }
      // 解析为BUFFER数据
      // 我们会把文件切片处理：把一个文件分割成为好几个部分（固定数量/固定大小）
      // 每一个切片有自己的部分数据和自己的名字
      // HASH_1.mp4
      // HASH_2.mp4
      // ...
      const buffer = await fileParse(file, 'buffer')
      const spark = new SparkMD5.ArrayBuffer()
      spark.append(buffer)
      const hash = spark.end()
      const suffix = /\.([0-9a-zA-Z]+)$/i.exec(file.name)[1]

      // 创建100个切片
      const partList = []
      const partsize = file.size / 100
      let cur = 0
      for (let i = 0; i < 100; i++) {
        const item = {
          chunk: file.slice(cur, cur + partsize),
          filename: `${hash}_${i}.${suffix}`
        }
        cur += partsize
        partList.push(item)
      }

      this.partList = partList
      this.hash = hash
      this.sendRequest()
    },
    async sendRequest() {
      // 根据100个切片创造100个请求（集合）
      const requestList = []
      this.partList.forEach((item, index) => {
        // 每一个函数都是发送一个切片的请求
        const fn = () => {
          const formData = new FormData()
          formData.append('chunk', item.chunk)
          formData.append('filename', item.filename)
          return axios
            .post('/upload/uploadVideo', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then((result) => {
              result = result.data
              if (result.code === 0) {
                this.total += 1
                // 传完的切片我们把它移除掉
                this.partList.splice(index, 1)
              }
            })
        }
        requestList.push(fn)
      })

      // 传递：并行(ajax.abort())/串行(基于标志控制不发送)
      let i = 0
      const complete = async () => {
        let result = await axios.get('/upload/mergeVideo', {
          params: {
            hash: this.hash
          }
        })
        result = result.data
        if (result.code === 0) {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.uploadVideo.push(result.path)
          console.log(result.path)
          console.log(this.uploadVideo)
          this.total = 0
        }
      }
      const send = async () => {
        // 已经中断则不再上传
        if (this.abort) return
        if (i >= requestList.length) {
          // 都传完了
          complete()
          return
        }
        await requestList[i]()
        i++
        send()
      }
      send()
    },
    progressHandleBtn() {
      if (this.progressBtn) {
        // 断点续传
        this.abort = false
        this.progressBtn = false
        this.sendRequest()
        return
      }
      // 暂停上传
      this.progressBtn = true
      this.abort = true
    },
    publishArticle(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const newUploadImg = []
          this.uploadImg.forEach((item,i,arr) => {
            if (item) {
              newUploadImg.push(item)
            }
          })
          const dataObj = {
            username: this.$store.state.userInfo.userInfo.username,
            title: this.articleInfo.title,
            aid: this.articleInfo.aid,
            describe: this.articleInfo.describe,
            content: this.articleInfo.content,
            userID: this.$store.state.userInfo.userInfo._id,
            uploadImg: newUploadImg,
            uploadVideo: this.uploadVideo,
            tags: this.dynamicTags
          }
          await axiosObj.request({
            url: '/article/publishArticle',
            method: 'post',
            data: dataObj
          }).then(res => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '发布成功'
            })
            this.$refs[formName].resetFields()
            if (this.radio === 1) {
              this.$router.push('/petshomecontent')
            } else if (this.radio === 2) {
              this.$router.push('/petscommunity')
            } else if (this.radio === 3) {
              this.$router.push('/petswiki')
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '发布出错'
          })
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
#public-article {
  width: 100%;
  padding-top: 60px;
  .article-container {
    width: 100%;
      .article-header {
        border-bottom: 1px solid #f0f0f0;
        font-weight: 500;
        padding: 10px 30px;
      }
      .article-edit {
        padding-left: 80px;
        .el-form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          .el-form-item {
            margin-top: 20px;
            display: flex;
            .el-radio-group {
              .el-radio {
                display: inline-block;
                width: 100px;
                text-align: center;
                border-radius: 5px;
                line-height: 30px;
                background-color: #409EFF;
              }
            }
            .el-button {
              width: 120px;
              margin-left: 60px;
            }
          }
          .el-form-item:nth-child(6) {
            .upload {
              display: flex;
              .upload-video {
                margin-right: 20px;
              }
            }
          }
        }
      }
  }
}

.upload-progress {
  letter-spacing: 1px;
  font-size: 18px;
  color: #409EFF;
  .el-link {
    display: inline-block;
    margin-left: 50px;
    line-height: 18px;
  }
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
