import request from '@/utils/request'

// 提交注册
export default {
  register(data) {
    return request({
      url: '/register',
      method: 'post',
      data: data
    })
  }
}

