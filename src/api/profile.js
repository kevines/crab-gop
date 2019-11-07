import request from '@/utils/request'

export function changePassword(query) {
  return request({
    url: '/mgr/changeAdminPwd',
    method: 'post',
    params: query
  })
}
