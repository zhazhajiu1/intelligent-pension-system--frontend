import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 进度条样式
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login', '/register'] // 免重定向白名单

router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 获取 token
  const token = localStorage.getItem('token')

  if (process.env.NODE_ENV === 'development') {
    // 如果是开发环境，直接跳过登录验证
    next()
    NProgress.done()
  } else {
    if (token) {
      const role = localStorage.getItem('role')

      if (to.path === '/login') {
        // 如果已经登录，重定向到首页
        next({ path: '/' })
        NProgress.done()
      } else {
        if (role === '0') {
          // 管理员，放行全部路由
          next()
        } else if (role === '1' || role === '2') {
          // 员工和义工，限制系统管理中的权限
          if (to.path.startsWith('/sys/data') || to.path.startsWith('/sys/videoData')) {
            Message.error('您没有权限访问该页面')
            next(from.path)
            NProgress.done()
          } else {
            next()
          }
        } else {
          // 未知角色，重新登录
          await store.dispatch('user/logout')
          Message.error('登录无效，请重新登录')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    } else {
      // 没有 token
      if (whiteList.includes(to.path)) {
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
