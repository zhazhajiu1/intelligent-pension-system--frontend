import request from '@/utils/request'

// 提交注册
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
      url: `/user/delete/${id}`,
      method: 'delete'
    })
  }

}

