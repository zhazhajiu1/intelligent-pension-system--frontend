import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  // headers: {
  //   'Content-Type':'application/x-www-form-urlencoded',
  //   'Access-Control-Allow-Origin':'*'     
  // },
  // headers: {'Content-Type':'application/json'},
  // headers: {'Content-Type':'application/x-www-form-urlencoded'},

})

// request interceptor
service.interceptors.request.use(
  async config => {
    // 在发送请求之前做些什么

    if (store.getters.token) {
      // 让每个请求携带自定义 token
      // ['X-Token'] 是自定义的请求头键名
      // 根据实际情况修改
      config.headers['X-Token'] = getToken()
    }

    // 获取 CSRF token
    // const csrfToken = await getCSRFToken();

    // 设置 CSRF token 到请求头
    // config.headers['X-CSRFToken'] = csrfToken;

    return config
  },
  error => {
    // 请求错误时做些什么
    console.log(error) // 调试用
    return Promise.reject(error)
  }
)

// response interceptor
// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res; // 这里直接返回解析后的数据
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)


// Function to get CSRF token
// function getCSRFToken() {
//   return new Promise((resolve, reject) => {
//     axios.get('http://127.0.0.1:8000/getcsrf/')
//       .then(response => {
//         const csrfToken = response.data.csrfToken
//         // 将CSRF令牌设置为请求头
//         axios.defaults.headers.common['X-Csrftoken'] = csrfToken
//         resolve(csrfToken)
//       })
//       .catch(error => {
//         reject(error)
//       })
//   })
// }

export default service
