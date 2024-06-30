import request from '@/utils/request'

export default {
  getList(data) {
    return request({
      url: '/user/elderlyList',
      method: 'get',
      params: data
    })
  },

  employeeAdd(data) {
    return request({
      url: '/user/elderlyAdd',
      method: 'post',
      data: data
    })
  },

  employeeUpdate(data) {
    return request({
      url: '/user/employeeUpdate',
      method: 'put',
      data: data
    })
  },

  deleteVideoById(id) {
    return request({
      url: `/user/elderlyDelete`,
      method: 'delete',
      params: id
    })
  },

  getOne(data) {
    return request({
      url: '/user/elderlyDetailByID',
      method: 'get',
      params: data
    })
  },

}

