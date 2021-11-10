<template>
  <div id="footer-com">
    <div class="footer-box">
      <div class="footer-container">
        <div class="block web-block">
          <h2>站内板块</h2>
          <ul>
            <li><router-link to="/PetsHome">宠物之家</router-link></li>
            <li><router-link to="/PetsCommunity">宠物社区</router-link></li>
            <li><router-link to="/PetsStore">宠物商店</router-link></li>
            <li><router-link to="/PetsWiki">宠物百科</router-link></li>
          </ul>
        </div>
        <div class="block about-us">
          <h2>了解我们</h2>
          <ul>
            <li><router-link to="/Home">关于我们</router-link></li>
            <li><router-link to="/Home">加入我们</router-link></li>
          </ul>
        </div>
        <div class="block about-info">
          <h2>相关信息</h2>
          <ul>
            <li><router-link to="/Home">隐私政策</router-link></li>
            <li><router-link to="/Home">用户服务协议</router-link></li>
          </ul>
        </div>
        <div class="block contact-us">
          <h2>联系方法</h2>
          <ul class="contact-us-list">
            <li><i class="iconfont icon-dizhi"></i>&nbsp;地址:湖北省武汉市洪山区狮子山街道南李路28号</li>
            <li><i class="iconfont icon-dianhua"></i>&nbsp;电话:13297254271 孙先生</li>
            <li><i class="iconfont icon-youxiang"></i>&nbsp;邮箱:2225331618@qq.com</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="copyright-text">Copyright &copy; Online Tutorials. All Rights Reserved.</div>
  </div>
</template>

<script>
export default {
  name: 'footer-com',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
#footer-com {
  position: relative;
  bottom: 0;
  .footer-box {
    position: relative;
    width: 100%;
    height: auto;
    padding: 50px 100px;
    background-color: #111;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .footer-container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .block {
        margin-right: 30px;
        h2 {
          position: relative;
          color: #fff;
          font-weight: 500;
          margin-bottom: 15px;
        }
        h2:before {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 50px;
          height: 2px;
          background-color: #f00;
        }
        ul {
          li {
            list-style: none;
            color: #999;
            margin-bottom: 10px;
            a {
              color: #999;
            }
            a:hover {
              color: #fff;
            }
          }
        }
      }
      .web-block {
        width: 25%;
      }
      .about-us {
        position: relative;
        width: 25%;
      }
      .about-info {
        position: relative;
        width: 25%;
      }
      .contact-us {
        width: calc(25% - 90px);
        margin-right: 0 !important;
        .contact-us-list {
          li {
            i {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
  .copyright-text {
    width: 100%;
    background-color: #181818;
    padding: 8px 100px;
    text-align: center;
    color: #999;
  }
}

@media (max-width: 991px) {
  #footer-com {
    .footer-box {
      padding: 40px;
      .footer-container {
        flex-direction: column;
        .block {
          margin-right: 0;
          margin-bottom: 40px;
          width: 100%;
        }
      }
    }
    .copyright-text {
      padding: 8px 40px;
    }
  }
}
</style>
