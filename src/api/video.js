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
  },

  getURL3() {
    return request({
      url: '/video/getUrl3',
      method: 'get'
    })
  },

  getURL4() {
    return request({
      url: '/video/getUrl4',
      method: 'get'
    })
  },

  sendCoordinates() {
    return request({
      url: '/video/getXY',
      method: 'post'
    })
  },
}
