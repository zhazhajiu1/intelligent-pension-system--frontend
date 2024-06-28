import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (process.env.NODE_ENV === 'development') {
    // 如果是开发环境，直接跳过登录验证
    next()
    NProgress.done()
  } else {
    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasGetUserInfo = store.getters.name
        if (hasGetUserInfo) {
          next()
        } else {
          try {
            // get user info
            const data = await store.dispatch('user/getInfo')
            if (data.roles[0] === 'admin') {
              const accessRoutes = await store.dispatch('permission/generateRoutes', ['admin'])
              console.log(accessRoutes)
              router.options.routes = store.getters.permission_routes
              router.addRoutes(accessRoutes)
            } else {
              const accessRoutes = await store.dispatch('permission/generateRoutes', ['visitor'])
              console.log(accessRoutes)
              router.options.routes = store.getters.permission_routes
              router.addRoutes(accessRoutes)
            }
            next({
              ...to,
              replace: true
            })
          } catch (error) {
            // remove token and go to login page to re-login
            console.log('出错了')
            await store.dispatch('user/logout')
            Message.error('登录无效')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      /* has no token*/

      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
