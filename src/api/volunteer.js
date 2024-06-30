import request from '@/utils/request'

// 提交注册
export default {
  getList(data) {
    return request({
      url: '/user/volunteerList',
      method: 'get',
      params: data
    })
  },

  employeeAdd(data) {
    return request({
      url: '/user/volunteerAdd',
      method: 'post',
      data: data
    })
  },

  employeeUpdate(data) {
    return request({
      url: '/user/volunteerUpdate',
      method: 'put',
      data: data
    })
  },

  deleteVideoById(id) {
    return request({
      url: `/user/volunteerDelete`,
      method: 'delete',
      params: id
    })
  },

  getOne(data) {
    return request({
      url: '/user/volunteerDetailByID',
      method: 'get',
      params: data
    })
  },

}

