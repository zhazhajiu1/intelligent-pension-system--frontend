import {
  asyncRoutes,
  constantRoutes
} from '@/router'

/**
 * 使用 meta.roles 来确定当前用户是否具有权限
 * @param roles 用户的角色
 * @param route 路由对象
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // 如果路由对象定义了 meta.roles 属性，则判断用户的角色是否包含在内
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 如果路由对象没有定义 meta.roles 属性，则默认允许访问
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes 异步路由表
 * @param roles 用户的角色
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        // 如果有子路由，递归过滤子路由
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],      // 存储过滤后的路由表
  addRoutes: []    // 存储动态添加的路由表
}

const mutations = {
  /**
   * 设置路由表
   * @param state Vuex state
   * @param routes 过滤后的路由表
   */
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes) // 将过滤后的路由和常量路由合并存储
  }
}

const actions = {
  /**
   * 生成符合用户角色权限的路由表
   * @param commit Vuex commit
   * @param roles 用户的角色
   */
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = []
      // 管理员 admin 显示全部路由
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // }
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles) // 根据角色过滤异步路由
      commit('SET_ROUTES', accessedRoutes) // 提交至 mutations 存储路由
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
