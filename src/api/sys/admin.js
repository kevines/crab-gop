import request from '@/utils/request'

/**
 * 查询管理员列表
 * @param page 查询第几页 必填 初始 0 已下架 1 已上架
 * @param limit 查询数据条数 必填 初始 10
 * /mgr/list.do
 */
export function queryAdmin(query) {
  return request({
    url: '/mgr/list.do',
    method: 'post',
    params: query
  })
}

/**
 * 新增管理员
 * @param account 用户名
 * @param password 密码
 * @param roleId 角色ID
 * /mgr/addItem.do
 */
export function addAdmin(query) {
  return request({
    url: '/mgr/addItem.do',
    method: 'post',
    params: query
  })
}

/**
 * 修改管理员
 * @param userId 用户ID
 * @param roleId 角色ID
 * @param password 密码
 * @param account 管理员名称
 * /mgr/edit.do
 */
export function editAdmin(query) {
  return request({
    url: '/mgr/edit.do',
    method: 'post',
    params: query
  })
}

/**
 * 删除角色
 * @param userId 角色ID
 * /mgr/delete.do
 */
export function delAdmin(query) {
  return request({
    url: '/mgr/delete.do',
    method: 'post',
    params: query
  })
}

