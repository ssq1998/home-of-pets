<template>
    <div id="edit-profile">
        <div class="edit-header-title">
            <p>编辑资料</p>
        </div>
        <div class="edit-main-content">
            <div class="edit-head-portrait">
                <img v-lazy="user.userPhoto">
                <el-upload
                    action
                    :auto-upload="false"
                    :on-change="uploadPicFile"
                    :multiple="false"
                  >
                    <span>修改头像</span>
                </el-upload>
            </div>
            <div class="edit-main-profile">
                <p>
                    <span>昵称</span>
                    <el-input
                        type="text"
                        v-model="user.username"
                        minlength="6"
                        maxlength="10"
                        show-word-limit
                    >
                    </el-input>
                </p>
                <p>
                    <span>性别</span>
                    <el-radio-group v-model="user.sex">
                        <el-radio :label="'male'">男</el-radio>
                        <el-radio :label="'female'">女</el-radio>
                        <el-radio :label="'secret'">秘密</el-radio>
                    </el-radio-group>
                </p>
                <p>
                    <span>生日</span>
                    <el-date-picker
                        v-model="user.birth"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </p>
                <p>
                    <span>个性签名</span>
                    <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="user.signature"
                        maxlength="50"
                        show-word-limit
                        >
                    </el-input>
                </p>
            </div>
            <div class="edit-footer-content">
                <div class="edit-btn" @click="saveEditUserInfo">保存</div>
            </div>
        </div>
    </div>
</template>

<script>
import axiosObj from '@/api/axios'
import axios from 'axios'
import { fileParse } from '../config/uploadfile'
import qs from 'qs'

export default {
  data() {
    return {
    }
  },
  computed: {
    user() {
      return this.$store.state.userInfo.userInfo
    }
  },
  methods: {
    async saveEditUserInfo() {
      const user = await axiosObj.request({
        url: 'user/updateUserInfo',
        method: 'post',
        data: this.user
      })
      if (user) {
        this.$store.dispatch('userInfo/setUserInfo', user.data)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
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
        const user = await axiosObj.request({
          url: 'user/updateUserPhoto',
          method: 'post',
          data: {
            _id: this.$store.state.userInfo.userInfo._id,
            userPhoto: result.path
          }
        })
        if (user) {
          this.$store.dispatch('userInfo/setUserInfo', user.data)
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
#edit-profile {
    background-color: rgba(#fff,0.3);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    width: 750px;
    .edit-header-title {
        padding: 10px 25px;
        border-bottom: 1px solid #c2bebe;
    }
    .edit-main-content {
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .edit-head-portrait {
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
                width: 120px;
                height: 120px;
                border-radius: 50%;
            }
            p {
                color: #999;
                margin-top: 10px;
                font-size: 15px;
                cursor: pointer;
                transition: 0.2s;
            }
            p:hover {
                color: skyblue;
            }
        }
        .edit-main-profile {
            display: flex;
            flex-direction: column;
            p {
                display: flex;
                width: 600px;
                padding: 15px 0;
                font-size: 15px;
            }
            p:nth-of-type(1) {
                span {
                    width: 70px;
                    text-align: right;
                }
                .el-input {
                    margin-left: 30px;
                    width: 300px;
                }
            }
            p:nth-of-type(2) {
                span:nth-of-type(1) {
                    width: 70px;
                    text-align: right;
                }
                .el-radio-group {
                    padding-left: 30px;
                }
            }
            p:nth-of-type(3) {
                span {
                    width: 70px;
                    text-align: right;
                }
            }
            p:nth-of-type(3) :nth-child(2) {
                padding-left: 30px;
            }
            p:nth-of-type(4) {
                span {
                    width: 70px;
                    text-align: right;
                }
            }
            p:nth-of-type(4) :nth-child(2) {
                padding-left: 30px;
            }
        }
        .edit-footer-content {
            margin-top: 50px;
            .edit-btn {
                width: 100px;
                height: 40px;
                line-height: 40px;
                font-size: 16px;
                font-weight: 300;
                border-radius: 4px;
                text-align: center;
                color:  rgb(105, 134, 230);
                border: 1px solid rgb(105, 134, 230);
                cursor: pointer;
                transition: 0.2s;
            }
            .edit-btn:hover {
                color: rgba(105, 134, 230, 0.5);
                border: 1px solid rgba(105, 134, 230, 0.5);
            }
        }
    }
}
</style>
