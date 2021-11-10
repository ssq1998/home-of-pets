<template>
    <div id="my-collection">
        <div class="collection-header-title">
            <p>我的收藏</p>
        </div>
        <div class="collection-nav">
            <div class="collection-nav-content">
                <router-link to="/myarticlecollection"><span>社文</span></router-link>
                <router-link to="/myvideocollection"><span>视频</span></router-link>
                <router-link to="/mywikicollection"><span>百科</span></router-link>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
#my-collection {
    background-color: rgba(#fff, 0.3);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    width: 750px;
    .collection-header-title {
        padding: 10px 25px;
        border-bottom: 1px solid #c2bebe;
    }
    .collection-nav {
        display: flex;
        justify-content: left;
        padding: 10px 25px;
        .collection-nav-content {
            width: 200px;
            display: flex;
            justify-content: space-around;
            color: #999;
            font-size: 15px;
        }
        .collection-nav-content :nth-child(1):hover {
            color: skyblue;
        }
    }
}
</style>
