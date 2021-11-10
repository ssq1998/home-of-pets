<template>
  <div id="home">
    <header-com></header-com>
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderCom from '../components/HeaderCom.vue'

export default {
  data() {
    return {
    }
  },
  components: {
    HeaderCom
  }
}
</script>

<style lang="less" scoped>
#home {
}
</style>
