<template>
  <div>
    <Editor :init="init" v-model="content"></Editor>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import tinymce from './tinymce.min.js'
import './icons/default/icons.min.js'
import './themes/silver/theme.min.js'
import './langs/zh_CN'

// 注册插件
import './plugins/preview/plugin.min.js'
import './plugins/paste/plugin.min.js'
import './plugins/wordcount/plugin.min.js'
import './plugins/code/plugin.min.js'
import './plugins/image/plugin.min.js'
import './plugins/imagetools/plugin.min.js'

import axios from 'axios'
export default {
  components: { Editor },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      init: {
        language: 'zh_CN',
        height: '500px',
        margin: '0',
        padding: '0',
        plugins: 'preview paste wordcount code image imagetools',
        branding: false,
        toolbar: ['undo redo | formatselect | alignleft aligncenter alignright alignjustify | preview paste code | image imagetools'],
        images_upload_handler: async(blobInfo, succFun, failFun) => {
          const formdata = new FormData()
          formdata.append('file', blobInfo.blob(), blobInfo.name())
          const { data: res } = await axios.post('/upload/uploadPic', formdata)
          succFun(res.path)
        }
      },
      content: this.value
    }
  },
  watch: {
    value(newVal) {
      this.content = newVal
    },
    content(newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./skins/ui/oxide/skin.min.css');
</style>
