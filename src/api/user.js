
import request from '@/utils/request'

export default {

  login(data) {
    return request({
      url: '/user/login',
      method: 'post',
      data: data
    })
  },

  logout() {
    return request({
      url: '/user/logout',
      method: 'post'
    })
  },

  getInfo() {
    return request({
      url: '/user/userInfo',
      method: 'get',
      // params: { token }
    })
  },

  updateInfo(data) {
    return request({
      url: '/user/userUpdateInfo',
      method: 'put',
      data: data
    })
  },

  uploadCloud(data) {
    return request({
      url: '/user/uploadCloud',
      method: 'post',
      data: data
    })
  }

  

  
}

