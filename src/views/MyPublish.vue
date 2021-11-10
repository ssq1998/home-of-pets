<template>
    <div id="my-publish">
        <div class="publish-header-title">
            <p>我的发布</p>
        </div>
        <div class="publish-nav">
            <div class="publish-nav-content">
                <router-link to="/myarticlepublish"><span>社文</span></router-link>
                <router-link to="/myvideopublish"><span>视频</span></router-link>
                <router-link to="/mywikipublish"><span>百科</span></router-link>
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
#my-publish {
    background-color: rgba(#fff, 0.3);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    width: 750px;
    .publish-header-title {
        padding: 10px 25px;
        border-bottom: 1px solid #c2bebe;
    }
    .publish-nav {
        display: flex;
        justify-content: left;
        padding: 10px 25px;
        .publish-nav-content {
            width: 200px;
            display: flex;
            justify-content: space-around;
            color: #999;
            font-size: 15px;
        }
        .publish-nav-content :nth-child(1):hover {
            color: skyblue;
        }
    }
}
</style>
