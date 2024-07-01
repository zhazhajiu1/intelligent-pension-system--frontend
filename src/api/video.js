import request from '@/utils/request'

// export function getURL() {
//   return request({
//     url: '/video/getURL',
//     method: 'get',
//     data
//   })
// }

export default {
  getURL() {
    return request({
      url: '/video/getUrl2',
      method: 'get'
    })
  },

  getURL_local() {
    return request({
      url: '/video/getUrl',
      method: 'get'
    })
  },

  stopVideo() {
    return request({
      url: '/video/stopVideo',
      method: 'get'
    })
  }
}
