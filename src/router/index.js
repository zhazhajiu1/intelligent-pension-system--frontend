import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Pages */
import Register from '@/views/register/index'
import Login from '@/views/login/index'
import NotFound from '@/views/404'
import Dashboard from '@/views/dashboard/index'
import UserInfo from '@/views/userInfo/index'
import Video from '@/views/video/index'
import UserManage from '@/views/sys/elds'
import DataManage from '@/views/sys/volunteers'
import VideoDataManage from '@/views/sys/staff.vue'
import HistoryDataPhoto from '@/views/historyData/index'
import HistoryDataVideo from '@/views/historyData/videoIndex'

export const constantRoutes = [
  {
    path: '/register',
    name: 'register',
    component: Register,
    hidden: true
  },
  {
    path: '/login',
    component: Login,
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/userInfo',
    component: Layout,
    redirect: '/userInfo/index',
    children: [{
      path: 'index',
      name: 'userInfo',
      component: UserInfo,
      meta: { title: '个人信息', icon: 'user' },
      hidden: true
    }]
  },
  {
    path: '/video',
    component: Layout,
    redirect: '/video/index',
    children: [{
      path: 'index',
      name: 'video',
      component: Video,
      meta: { title: '实时保护', icon: 'el-icon-video-camera' }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    name: 'sysManage',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: UserManage,
        meta: { title: '老人管理', icon: 'user' }
      },
      {
        path: 'data',
        name: 'data',
        component: DataManage,
        meta: { title: '义工管理', icon: 'el-icon-s-data' }
      },
      {
        path: 'videoData',
        name: 'videoData',
        component: VideoDataManage,
        meta: { title: '员工管理', icon: 'el-icon-s-data' }
      }
    ]
  },
  {
    path: '/historyData',
    component: Layout,
    redirect: '/historyData/index',
    name: 'historyData',
    meta: { title: '历史数据', icon: 'el-icon-s-data' },
    children: [
      {
        path: 'index',
        name: 'historyData',
        component: HistoryDataPhoto,
        meta: { title: '照片数据', icon: 'el-icon-s-data' }
      },
      {
        path: 'videoIndex',
        name: 'historyData',
        component: HistoryDataVideo,
        meta: { title: '视频数据', icon: 'el-icon-s-data' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes.concat(asyncRoutes) // 确保所有路由都被加载
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
