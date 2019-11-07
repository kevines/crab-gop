import request from '@/utils/request'

/**
 * 根据用户密码登录运营平台
 * @param {登录所需参数} query 
 */
export function loginByUsername(query) {
  // const data = {
  //   username,
  //   password
  // }
  // return request({
  //   url: '/auth/login',
  //   method: 'post',
  //   data
  // })
  return request({
    url: '/gop/login.do',
    method: 'post',
    params: query
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getUserInfo(query) {
  return request({
    url: 'mgr/getUserInfo',
    method: 'post',
    params: query
  })
}

