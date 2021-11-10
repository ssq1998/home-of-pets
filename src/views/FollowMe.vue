<template>
    <div id="follow-me">
        <div class="follow-header-title">
            <p>我的粉丝</p>
        </div>
        <div class="follow-nav">
            <div class="follow-item" v-for="(item,index) in list" :key="index">
                <div class="item-userInfo">
                    <img src="../assets/kejizhuce.jpeg">
                    <div class="follow-username">{{item.followUsername}}</div>
                </div>
                <div class="item-operation">
                    <div class="follow-operation">已关注</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          followUsername: 'ssq'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
#follow-me {
    background-color: rgba(#fff, 0.3);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    width: 750px;
    .follow-header-title {
        padding: 10px 25px;
        border-bottom: 1px solid #c2bebe;
    }
    .follow-nav {
        display: flex;
        justify-content: left;
        padding: 10px 25px;
        .follow-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 80px;
            .item-userInfo {
                display: flex;
                align-items: center;
              img {
                border-radius: 50%;
                width: 70px;
                height: 70px;
                cursor: pointer;
              }
              .follow-username {
                  font-weight: 300;
                  font-size: 16px;
                  margin-left: 25px;
                  cursor: pointer;
              }
              .follow-username:hover {
                  color: skyblue;
              }
            }
            .item-operation {
                .follow-operation {
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                }
                .follow-operation:hover {
                    background-color: rgb(241, 232, 232);
                    color: #e0d357;
                }
            }
        }
    }
}
</style>
