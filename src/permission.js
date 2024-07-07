import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/register']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const token = localStorage.getItem('token')

  if (process.env.NODE_ENV === !'development') {
    next()
    NProgress.done()
  } else {
    if (token) {
      const role = localStorage.getItem('roles')

      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        if (role === '0') {
          next()
        } else if (role === '1') {
          if (to.path.startsWith('/sys/videoData')) {
            Message.error('您没有权限访问该页面')
            next(from.path)
            NProgress.done()
          } else {
            next()
          }
        } else if (role === '2') {
          if (to.path.startsWith('/sys/data') || to.path.startsWith('/sys/videoData')) {
            Message.error('您没有权限访问该页面')
            next(from.path)
            NProgress.done()
          } else {
            next()
          }
        } else {
          await store.dispatch('user/logout')
          Message.error('登录无效，请重新登录')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
