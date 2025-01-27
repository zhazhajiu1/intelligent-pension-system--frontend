import request from '@/utils/request'

export default {
  getList(data) {
    return request({
      url: '/user/employeeList',
      method: 'get',
      params: data
    })
  },

  employeeAdd(data) {
    return request({
      url: '/user/employeeAdd',
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
      url: `/user/employeeDelete`,
      method: 'delete',
      params: id
    })
  },

  getOne(data) {
    return request({
      url: '/user/employeeDetailByID',
      method: 'get',
      params: data
    })
  },

}

