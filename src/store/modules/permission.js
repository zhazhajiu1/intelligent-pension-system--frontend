// store/modules/permission.js

import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('0')) {
        // 管理员角色，可以访问所有动态路由
        accessedRoutes = asyncRoutes || []
      } else {
        // 其他角色根据角色过滤路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        // 过滤子路由
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // 根据角色过滤路由
      if (roles.includes('2')) {
        // 如果是义工角色，排除义工管理页面
        if (tmp.path !== '/sys/data') {
          res.push(tmp)
        }
      } else if (roles.includes('1')) {
        // 如果是员工角色，排除员工管理页面
        if (tmp.path !== '/sys/videoData') {
          res.push(tmp)
        }
      } else {
        // 管理员角色或其他角色，添加所有路由
        res.push(tmp)
      }
    }
  })

  return res
}

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
