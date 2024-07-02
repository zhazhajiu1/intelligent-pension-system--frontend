import request from '@/utils/request'

export default {
  getList(data) {
    return request({
      url: '/video/emotionList',
      method: 'get',
      params: data
    })
  },

  emotionDelete(id) {
    return request({
      url: `/video/emotionDelete`,
      method: 'delete',
      params: id
    })
  },

  getOne(data) {
    return request({
      url: '/video/emotionDetailByID',
      method: 'get',
      params: data
    })
  },

  getFall(data) {
    return request({
      url: '/video/fallList',
      method: 'get',
      params: data
    })
  },

  getUnknow(data) {
    return request({
      url: '/video/unknowList',
      method: 'get',
      params: data
    })
  },

  unknowDelete(id) {
    return request({
      url: `/video/unknowDelete`,
      method: 'delete',
      params: id
    })
  },

  fallDelete(id) {
    return request({
      url: `/video/fallDelete`,
      method: 'delete',
      params: id
    })
  },

}

