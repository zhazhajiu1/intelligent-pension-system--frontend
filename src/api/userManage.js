import request from '@/utils/request'
// export function getList(params) {
//   return request({
//     url: '/vue-admin-template/table/list',
//     method: 'get',
//     params
//   })
// }
export default {
  getUserList(searchModel) {
    return request({
      url: '/user/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        phone: searchModel.phone
      }
    })
  },
  addUser(user) {
    return request({
      url: '/user/add',
      method: 'post',
      data: user
    })
  },
  // saveUser(user) {
  //   return request({
  //     url: '/user',
  //     method: 'put',
  //     data: user
  //   })
  // },
  getUserById(id) {
    return request({
      url: `/user/detail`,
      method: 'get',
      params: {id: id}
    })
  },
  deleteUserById(id) {
    return request({
      url: `/user/delete`,
      method: 'get',
      params: {id: id}
    })
  },
  updateUser(user) {
    return request({
      url: '/user/update',
      method: 'post',
      data: user
    })
  },
  saveUser(user) {
    if(user.id==null&&user.id == undefined) {
      return this.addUser(user);
    }
    return this.updateUser(user);
  }
}
