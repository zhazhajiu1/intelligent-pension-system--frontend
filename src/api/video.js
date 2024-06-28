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
      url: '/video/getURL',
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