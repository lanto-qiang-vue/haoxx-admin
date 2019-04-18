import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { getToken, getUser, getMenu, showThisMenuEle } from '@/libs/util'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
const LOGIN_PAGE_NAME2 = 'admin-login'

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  let isLogin = (getToken() && getUser() && getMenu())
  if (to.meta && to.meta.noLogin){
    next()
  } else if (!isLogin && (to.name !== LOGIN_PAGE_NAME && to.name !== LOGIN_PAGE_NAME2)) {
    // 未登录且要跳转的页面不是登录页
    console.log('1未登录且要跳转的页面不是登录页')
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
    // iView.LoadingBar.finish()
  } else if (!isLogin && (to.name === LOGIN_PAGE_NAME || to.name === LOGIN_PAGE_NAME2)) {
    console.log('2未登陆且要跳转的页面是登录页')
    // 未登陆且要跳转的页面是登录页
      next()
    // 跳转
    // iView.LoadingBar.finish()
  } else if (isLogin && (to.name === LOGIN_PAGE_NAME || to.name === LOGIN_PAGE_NAME2)) {
    console.log('3已登录且要跳转的页面是登录页')
    // 已登录且要跳转的页面是登录页
    let loginType = getUser().user.lgType
    next({
      name: loginType == '1002' ? 'home' : 'admin-home' // 跳转到home页
    })
  }else {
    console.log('4已登录，判断权限')
    // store.dispatch('getUserInfo').then(user => {
    // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
    if (showThisMenuEle(to, store.state.user)) next() // 有权限，可访问
    else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
    // })
  }
  if(to.name === from.name) iView.LoadingBar.finish()

  // next()
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
