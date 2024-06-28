import request from '@/utils/request'

export default {
  getDataList(searchModel) {
    // console.log(searchModel)
    return request({
      url: '/video/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        date: searchModel.date,
        action: searchModel.action
      }
    })
  },
  deleteDataById(id) {
    return request({
      url: `/video/delete`,
      method: 'get',
      params: { id: id }
    })
  },
  getDataURL(id) {
    return request({
      url: `/video/photoURL`,
      method: 'get',
      params: { id: id }
    })
  },
  getVideoList(searchModel) {
    // console.log(searchModel)
    return request({
      url: '/video/videoList',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        date: searchModel.date,
        action: searchModel.action
      }
    })
  },
  deleteVideoById(id) {
    return request({
      url: `/video/deleteVideo`,
      method: 'get',
      params: { id: id }
    })
  },
  getVideoURL(id) {
    return request({
      url: `/video/videoURL`,
      method: 'get',
      params: { id: id }
    })
  },
  getGraphURL() {
    return request({
      url: `/video/dashboard`,
      method: 'get'
    })
  }
}
