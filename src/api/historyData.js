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

  fallDelete(id) {
    return request({
      url: `/video/fallDelete`,
      method: 'delete',
      params: id
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

  getIntrusionList(data) {
    return request({
      url: '/video/intrusionList',
      method: 'get',
      params: data
    })
  },

  intrusionDelete(id) {
    return request({
      url: `/video/intrusionDelete`,
      method: 'delete',
      params: id
    })
  },

  getReactionList(data) {
    return request({
      url: '/video/reactionList',
      method: 'get',
      params: data
    })
  },

  reactionDelete(id) {
    return request({
      url: `/video/reactionDelete`,
      method: 'delete',
      params: id
    })
  },

  getReactionDetailByID(data) {
    return request({
      url: '/video/reactionDetailByID',
      method: 'get',
      params: data
    })
  },





}

