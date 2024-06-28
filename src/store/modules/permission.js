import {
    asyncRoutes,
    constantRoutes
  } from '@/router'
  
  /**
   * 使用 meta.role 以确定当前用户是否具有权限
   * @param roles
   * @param route
   */
  // 匹配权限
  function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
      return roles.some(role => route.meta.roles.includes(role))
    } else {
      return true
    }
  }
  
  /**
   * 通过递归过滤异步路由表
   * @param routes asyncRoutes
   * @param roles
   */
  export function filterAsyncRoutes(routes, roles) {
    const res = []
  
    routes.forEach(route => {
      const tmp = {
        ...route
      }
      if (hasPermission(roles, tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
        res.push(tmp)
      }
    })
  
    return res
  }
  
  const state = {
    routes: [],
    addRoutes: []
  }
  
  const mutations = {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes) // 将过滤后的路由和constantRoutes存起来
    }
  }
  
  // 筛选
  const actions = {
    generateRoutes({
      commit
    }, roles) {        
      return new Promise(resolve => {
        let accessedRoutes = []
        console.log("permission.js")
        console.log(roles)
        // 管理员admin显示全部路由
        // if (roles.includes('admin')) {
        //   accessedRoutes = asyncRoutes || []
        //   console.log("permission.js:"+accessedRoutes)
        //   console.log("if语句我进来了")
        // }
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        commit('SET_ROUTES', accessedRoutes)
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
