import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
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
import StaffDetail from '@/views/sys/staffDetail.vue'
import VolunteerDetail from '@/views/sys/volunteerDetail.vue'
import EldDetail from '@/views/sys/eldDetail.vue'
import UnknowIndex from '@/views/historyData/unknowIndex.vue'
import EmotionDetail from '@/views/historyData/emotionDetail.vue'
import IntrusionDetection from '@/views/video/IntrusionDetection.vue'
import FaceRecord from '@/views/video/faceRecord.vue'
import IntrusionIndex from '@/views/historyData/intrusionIndex.vue'
import Interaction from '@/views/video/Interaction.vue'
import InteractionIndex from '@/views/historyData/interactionIndex.vue'
import Fall from '@/views/video/fall.vue'
import AIChat from '@/views/aiChat/index.vue'

Vue.use(Router)

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
    path: '/',
    redirect: '/login',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    hidden: true
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    children: [
      {
        path: 'index',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
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
    meta: { title: '实时保护', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'video',
        component: Video,
        meta: { title: '情绪监测', icon: 'el-icon-video-camera' }
      },
      {
        path: 'fall',
        name: 'fall',
        component: Fall,
        meta: { title: '摔倒监测', icon: 'el-icon-video-camera' }
      },
      {
        path: 'intrusionDetection',
        name: 'intrusionDetection',
        component: IntrusionDetection,
        meta: { title: '入侵监测', icon: 'el-icon-video-camera' }
      },
      {
        path: 'interaction',
        name: 'interaction',
        component: Interaction,
        meta: { title: '交互检测', icon: 'el-icon-video-camera' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    name: 'sysManage',
    meta: { title: '系统管理', icon: 'example', roles: ['0', '1', '2'] },
    children: [
      {
        path: 'user',
        name: 'user',
        component: UserManage,
        meta: { title: '老人管理', icon: 'user', roles: ['0', '1', '2'] }
      },
      {
        path: 'eldDetail/:id',
        name: 'eldDetail',
        component: EldDetail,
        meta: { title: '老人详情', icon: 'el-icon-s-data', roles: ['0', '1', '2'] },
        hidden: true
      },
      {
        path: 'data',
        name: 'data',
        component: DataManage,
        meta: { title: '义工管理', icon: 'el-icon-s-data', roles: ['0', '1'] }
      },
      {
        path: 'volunteerDetail/:id',
        name: 'volunteerDetail',
        component: VolunteerDetail,
        meta: { title: '义工详情', icon: 'el-icon-s-data', roles: ['0', '1'] },
        hidden: true
      },
      {
        path: 'videoData',
        name: 'videoData',
        component: VideoDataManage,
        meta: { title: '员工管理', icon: 'el-icon-s-data', roles: ['0'] }
      },
      {
        path: 'staffDetail/:id',
        name: 'staffDetail',
        component: StaffDetail,
        meta: { title: '员工详情', icon: 'el-icon-s-data', roles: ['0'] },
        hidden: true
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
        meta: { title: '情绪记录', icon: 'el-icon-s-data' }
      },
      {
        path: 'emotionDetail/:id',
        name: 'emotionDetail',
        component: EmotionDetail,
        meta: { title: '情绪记录详情', icon: 'el-icon-s-data' },
        hidden: true
      },
      {
        path: 'unknowIndex',
        name: 'unknowIndex',
        component: UnknowIndex,
        meta: { title: '陌生人记录', icon: 'el-icon-s-data' }
      },
      {
        path: 'videoIndex',
        name: 'videoIndex',
        component: HistoryDataVideo,
        meta: { title: '摔倒记录', icon: 'el-icon-s-data' }
      },
      {
        path: 'intrusionIndex',
        name: 'intrusionIndex',
        component: IntrusionIndex,
        meta: { title: '入侵记录', icon: 'el-icon-s-data' }
      },
      {
        path: 'interactionIndex',
        name: 'interactionIndex',
        component: InteractionIndex,
        meta: { title: '交互记录', icon: 'el-icon-s-data' }
      }
    ]
  },
  {
    path: '/faceRecord',
    component: Layout,
    redirect: '/faceRecord',
    children: [{
      path: 'index',
      name: 'aiChat',
      component: FaceRecord,
      meta: { title: '人脸录入', icon: 'el-icon-video-camera' }
    }]
  },
  {
    path: '/aiChat',
    component: Layout,
    redirect: '/aiChat',
    children: [{
      path: 'index',
      name: 'aiChat',
      component: AIChat,
      meta: { title: 'AI养老助手', icon: 'user' }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes.concat(asyncRoutes)
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
