import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从 cookie 中获取 token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login', '/register'] // 免重定向白名单

router.beforeEach(async (to, from, next) => {

  // 开始进度条
  NProgress.start()
  
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  
  // 获取 token
  const hasToken = getToken()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (process.env.NODE_ENV === 'development') {
    // 如果是开发环境，直接跳过登录验证
    next()
    NProgress.done()
  } else {
    if (hasToken) {
      if (to.path === '/login') {
        // 如果已经登录，重定向到首页
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasGetUserInfo = store.getters.name
        if (hasGetUserInfo) {
          // 如果已获取用户信息，直接放行
          next()
        } else {
          try {
            // 获取用户信息
            const data = await store.dispatch('user/getInfo')
            if (data.roles[0] === 'admin') {
              // 如果是管理员，生成管理员路由
              const accessRoutes = await store.dispatch('permission/generateRoutes', ['admin'])
              console.log(accessRoutes)
              router.options.routes = store.getters.permission_routes
              router.addRoutes(accessRoutes)
            } else {
              // 如果是普通用户，生成普通用户路由
              const accessRoutes = await store.dispatch('permission/generateRoutes', ['visitor'])
              console.log(accessRoutes)
              router.options.routes = store.getters.permission_routes
              router.addRoutes(accessRoutes)
            }
            // 确保 addRoutes 已完成
            next({
              ...to,
              replace: true
            })
          } catch (error) {
            // 处理错误并重新登录
            console.log('出错了')
            await store.dispatch('user/logout')
            Message.error('登录无效')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      /* 没有 token */
      if (whiteList.indexOf(to.path) !== -1) {
        // 如果在免登录白名单中，直接放行
        next()
      } else {
        // 如果不在白名单中，重定向到登录页面
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
