import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

/**
 * 设置路径啥的，注意看看每个父路由的 created 生命周期
 */
const routes = [
  // 重定向
  {
    path: '/',
    redirect: '/console'
  },
  // transition过渡页面
  {
    path: '/transition',
    name: 'Transition',
    component: () => import('@/views/Transition/Transition')
  },
  // 注册登录页
  {
    path: '/auth',
    component: () => import('@/views/Auth/CloudAuth'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Auth/CloudLogin')
      },
      {
        path: 'reg',
        name: 'Reg',
        component: () => import('@/views/Auth/CloudReg')
      }
    ]
  },
  // 协议政策页
  {
    path: '/agreement',
    component: () => import('@/views/Agreement/Agreement'),
    children: [
      // 用户使用协议
      {
        path: 'clientPolicy',
        name: 'ClientPolicy',
        component: () => import('@/views/Agreement/ClientPolicy')
      },
      // 隐私政策
      {
        path: 'privacyPolicy',
        name: 'PrivacyPolicy',
        component: () => import('@/views/Agreement/PrivacyPolicy')
      }
    ]
  },
  // main 入口
  {
    path: '/console',
    name: 'Home',
    component: () => import('@/views/Main')
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  // 获取 token
  store.commit('user/getToken')
  // 获取 user
  store.commit('user/getUser')
  // 获取菜单树
  store.dispatch('menu/getMenuTree')

  // 是否有 token
  const isToken = store.state.user.token
  // 是否有当前用户数据信息
  const isUser = store.state.user.user
  const toLogin = to.path.indexOf('/auth') > -1
  const toAgreement = to.path.indexOf('/agreement') > -1
  let isNext = true

  // 无 token 或无 user信息
  if (!isToken || !isUser) {
    // 并且非登录页面、非协议界面
    if (!toLogin && !toAgreement) {
      // 强制前往登录
      isNext = { name: 'Login' }
    }
  } else if (isToken && toLogin) {
    if (from.path === '/') {
      isNext = '/transition'
    } else {
      // 已登录无法前往登录页面
      isNext = false
    }
  }
  // console.log('isNext', isNext)
  // console.log('isToken', isToken)
  // console.log('toLogin', toLogin)
  // console.log('to', to)
  // console.log('from', from)

  // // 首页、应用是固定的
  // const fixedMenus = ['/', '/console']
  // const routeModules = routes.find(({ path }) => path === '/').children
  // console.log('%c [ routeModules ]', 'font-size:13px; background:pink; color:#bf2c9f;', routeModules)

  // // 拿到当前路由的父路径
  // const currParent = routeModules.find(item => {
  //   if (fixedMenus.indexOf(item.path) === -1) {
  //     return to.path.indexOf(item.path) > -1
  //   }
  // })
  // console.log('%c [ to.path ]', 'font-size:13px; background:pink; color:#bf2c9f;', to.path)
  // console.log('%c [ from.path ]', 'font-size:13px; background:pink; color:#bf2c9f;', from.path)
  // console.log('%c [ currParent ]', 'font-size:13px; background:pink; color:#bf2c9f;', currParent)

  // const menuList = store.state.menu.menuList
  // const isFind = menuList.findIndex(item => {
  //   return currParent ? item.name === currParent.path : false
  // }) > -1
  // if (isToken && currParent && currParent.meta && !isFind && fixedMenus.indexOf(to.path) === -1) {
  //   store.commit('menu/addMenu', {
  //     title: currParent.meta.title,
  //     name: currParent.path,
  //     closable: true
  //   })
  // }

  next(isNext)
})

export default router
