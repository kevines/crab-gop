import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 1000 * 60 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    // config.headers['Authorization'] = '4bc31b22-baeb-4377-b87f-a454a8226525'
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Litemall-Admin-Token']为自定义key 请根据实际情况自行修改
      // config.headers['X-Litemall-Admin-Token'] = getToken()
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    // debugger
    const res = response.data
    if (res.code === 302) {
      MessageBox.alert('登录过期，请重新登录', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      })
      return Promise.reject('error')
    } else if (res.code === 303) {
      MessageBox.alert('登录失效，请重新登录', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      })
      return Promise.reject('error')
    } else if (res.code === 400) {
      MessageBox.alert(res.message, '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else if (res.code === 500) {
      MessageBox.alert(res.message, '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else {
      return response
    }
  }, error => {
    const errorCode = JSON.parse(JSON.stringify(error)).response.data.code
    const txt = JSON.parse(JSON.stringify(error)).response.data.message
    if (errorCode === 302) {
      MessageBox.alert('您的账号已在其它地方登陆，若不是本人操作，请注意账号安全！', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      })
    } else if (errorCode === 303) {
      MessageBox.alert('登录失效，请重新登录', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      })
    } else if (errorCode === 400) {
      Message({
        message: txt,
        type: 'error',
        duration: 60 * 1000
      })
    } else if (errorCode === 500) {
      Message({
        message: txt,
        type: 'error',
        duration: 60 * 1000
      })
    } else {
      Message({
        message: txt,
        type: 'error',
        duration: 60 * 1000
      })
    }
    // Message({
    //   message: '登录连接超时（后台不能连接，请联系系统管理员）',
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  })
export default service

