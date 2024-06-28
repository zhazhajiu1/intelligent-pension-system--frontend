import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [ 

  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/userInfo',
    component: Layout,
    redirect: '/userInfo/index',
    children:[{
      path: 'index',
      name: 'userInfo',
      component: () => import('@/views/userInfo/index'),
      meta: { title: '个人信息', icon: 'user'},
    }]    
  },

  {
    path: '/video',
    component: Layout,
    redirect: '/video/index',
    children:[{
      path: 'index',
      name: 'video',
      component: () => import('@/views/video/index'),
      meta: { title: '监控视频', icon: 'el-icon-video-camera'},
    }]    
  },

  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

//异步挂载的路由
//动态需要根据权限加载的路由表
//每个页面给哪些角色放行，在roles数组提前写好即可
export const asyncRoutes = [
  //用户设置
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    name: 'sysManage',
    meta: { title: '系统管理', icon: 'example', roles: ['admin']},
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/sys/user'),
        meta: { title: '用户管理', icon: 'user', roles: ['admin']}
      },
      {
        path: 'data',
        name: 'data',
        component: () => import('@/views/sys/data'),
        meta: { title: '照片数据管理', icon: 'el-icon-s-data', roles: ['admin']}
      },
      {
        path: 'videoData',
        name: 'videoData',
        component: () => import('@/views/sys/videoData'),
        meta: { title: '视频数据管理', icon: 'el-icon-s-data', roles: ['admin']}
      }
    ]
  },
  
  {
    path: '/historyData',
    component: Layout,
    redirect: '/historyData/index',
    name: 'historyData',
    meta: { title: '历史数据', icon: 'el-icon-s-data', roles: ['visitor']},
    children:[
      {
        path: 'index',
        name: 'historyData',
        component: () => import('@/views/historyData/index'),
        meta: { title: '照片数据', icon: 'el-icon-s-data', roles: ['visitor']}
      },
      {
        path: 'videoIndex',
        name: 'historyData',
        component: () => import('@/views/historyData/videoIndex'),
        meta: { title: '视频数据', icon: 'el-icon-s-data', roles: ['visitor']}
      }      
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
