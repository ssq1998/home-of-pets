<template>
  <div id="manage-order">
    <div class="manage-order-nav">
        <router-link to="/checkorder">确认订单</router-link>
        <router-link to="/inprogress">进行中</router-link>
        <router-link to="/orderhistory">历史订单</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
#manage-order {
    background-color: lightblue;
    .manage-order-nav {
        width: 100%;
        height: 120px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        a {
            position: relative;
            padding: 15px 30px;
            background: skyblue;
            color: #fff;
            letter-spacing: 1px;
            transition: 0.5s;
            overflow: hidden;
        }
        a:hover {
            background-color: #ff3c7f;
        }
        a::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, #fff,transparent);
            transition: 0.5s;
        }
        a:hover:before {
            left: 100%;
        }
    }
}
</style>
