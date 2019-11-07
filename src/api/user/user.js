import request from '@/utils/request'

/**
 * 查询app用户
 * @param countyCode 县域code 选填
 * @param name 用户昵称 选填
 * @param phone 手机号 选填
 * @param roleCode 用户角色 选填
 * @param pageNo 查询第几页 必填 初始 1
 * @param pageSzie 查询数据条数 必填 初始 10
 */
export function queryAppUser(query) {
  return request({
    url: '/appUser/list.do',
    method: 'post',
    params: query
  })
}

/**
 * 查询用户详情
 * @param {*} query 
 */
export function queryAppUserDetail(query) {
  return request({
    url: '/appUser/detail.do',
    method: 'post',
    params: query
  })
}
