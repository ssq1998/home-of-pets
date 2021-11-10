import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../views/Login.vue')
const Home = () => import('../views/Home.vue')
const Register = () => import('../views/Register.vue')
const PetsStore = () => import('../views/PetsStore.vue')
const PetsHome = () => import('../views/PetsHome.vue')
const PetsCommunity = () => import('../views/PetsCommunity.vue')
const PetsWiki = () => import('../views/PetsWiki.vue')
const PublishArticle = () => import('../views/PublishArticle.vue')
const PetsCart = () => import('../views/PetsCart.vue')
const NotFound = () => import('../views/404.vue')
const PersonalCenter = () => import('../views/PersonalCenter.vue')
const EditProfile = () => import('../views/EditProfile.vue')
const MyPublish = () => import('../views/MyPublish.vue')
const MyCollection = () => import('../views/MyCollection.vue')
const MyFollow = () => import('../views/MyFollow.vue')
const MyVideoPublish = () => import('../views/MyVideoPublish.vue')
const MyArticlePublish = () => import('../views/MyArticlePublish.vue')
const MyWikiPublish = () => import('../views/MyWikiPublish.vue')
const MyVideoCollection = () => import('../views/MyVideoCollection.vue')
const MyArticleCollection = () => import('../views/MyArticleCollection.vue')
const MyWikiCollection = () => import('../views/MyWikiCollection.vue')
const CheckOrder = () => import('../views/CheckOrder.vue')
const ArticleDetail = () => import('../views/ArticleDetail.vue')
const StoreClassify = () => import('../views/StoreClassify.vue')
const HomeMain = () => import('../views/HomeMain.vue')
const ManageOrder = () => import('../views/ManageOrder.vue')
const InProgress = () => import('../views/InProgress.vue')
const OrderHistory = () => import('../views/OrderHistory.vue')
const PetsWikiContent = () => import('../views/PetsWikiContent.vue')
const PetsHomeContent = () => import('../views/PetsHomeContent.vue')
const SellerRegister = () => import('../views/SellerRegister.vue')
const SellerCenter = () => import('../views/SellerCenter.vue')
const GoodDetail = () => import('../views/GoodDetail.vue')
const AdminiInterface = () => import('../views/AdminiInterface.vue')
const WaitOrder = () => import('../views/WaitOrder.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      alias: '/home',
      component: Home,
      redirect: '/homemain',
      children: [
        { path: '/homemain', component: HomeMain },
        { path: '/petshome', component: PetsHome },
        { path: '/petshomecontent', component: PetsHomeContent },
        { path: '/petscommunity', component: PetsCommunity },
        { path: '/articledetail/:obj', name: 'ArticleDetail', component: ArticleDetail },
        { path: '/petsstore', component: PetsStore },
        { path: '/storeclassify/:classification', name: 'StoreClassify', component: StoreClassify },
        { path: '/petscart', component: PetsCart },
        { path: '/petswiki', component: PetsWiki },
        { path: '/petswikicontent', component: PetsWikiContent },
        {
          path: '/manageorder',
          component: ManageOrder,
          redirect: '/checkorder',
          children: [
            { path: '/checkorder', component: CheckOrder },
            { path: '/inprogress', component: InProgress },
            { path: '/orderhistory', component: OrderHistory }
          ]
        },
        {
          path: '/personalcenter',
          component: PersonalCenter,
          redirect: '/editprofile',
          children: [
            { path: '/editprofile', component: EditProfile },
            {
              path: '/mypublish',
              component: MyPublish,
              redirect: '/myarticlepublish',
              children: [
                { path: '/myvideopublish', component: MyVideoPublish },
                { path: '/myarticlepublish', component: MyArticlePublish },
                { path: '/mywikipublish', component: MyWikiPublish }
              ]
            },
            {
              path: '/mycollection',
              component: MyCollection,
              redirect: '/myarticlecollection',
              children: [
                { path: '/myvideocollection', component: MyVideoCollection },
                { path: '/myarticlecollection', component: MyArticleCollection },
                { path: '/mywikicollection', component: MyWikiCollection }
              ]
            },
            { path: '/myfollow', component: MyFollow },
            { path: '/sellercenter', component: SellerCenter },
            { path: '/gooddetail/:good', name: 'GoodDetail', component: GoodDetail },
            { path: '/waitorder', component: WaitOrder }
          ]
        },
        { path: '/publisharticle/:block', name: 'PublishArticle', component: PublishArticle },
        { path: '/sellerregister', component: SellerRegister },
        { path: '/adminiinterface', component: AdminiInterface }
      ]
    },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { alias: '404', path: '*', component: NotFound }
  ]
})

// 路由守卫
// router.beforeEach((to, from, next) => {
//   const isToken = localStorage.elementToken ? 'Yes' : 'No'
//   if (to.path === '/login' || to.path === '/register' || to.path === '/home') {
//     next()
//   } else {
//     isToken ? next() : next({ path: '/login' })
//   }
// })

// 路由守卫
router.beforeEach((to, from, next) => {
  let isToken = false
  if (localStorage.elementToken) {
    isToken = true
  }
  if (isToken || to.path === '/login' || to.path === '/register' || to.path === '/home') {
    next()
  } else {
    next({ path: '/login' })
  }
})

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
