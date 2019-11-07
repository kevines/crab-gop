import request from '@/utils/request'

/**
 * 查看角色列表
 * @param name 用户角色
 * @param page 查询第几页 必填 初始 0 已下架 1 已上架
 * @param limit 查询数据条数 必填 初始 10
 * /role/list.do
 */
export function queryRole(query) {
  return request({
    url: '/role/list.do',
    method: 'post',
    params: query
  })
}

/**
 * 新增角色
 * @param name 商品标题 选填
 * @param description 说明
 * /role/addItem.do
 */
export function addRole(query) {
  return request({
    url: '/role/addItem.do',
    method: 'post',
    params: query
  })
}

/**
 * 编辑角色
 * @param roleId 角色ID
 * @param name 商品标题 选填
 * @param description 说明
 * /role/editItem.do
 */
export function editRole(query) {
  return request({
    url: '/role/editItem.do',
    method: 'post',
    params: query
  })
}

/**
 * 删除角色
 * @param roleId 角色ID
 * /role/delete.do
 */
export function delRole(query) {
  return request({
    url: '/role/delete.do',
    method: 'post',
    params: query
  })
}

/**
 * 查询权限树
 * @param roleId 角色ID
 * /menu/menuTreeListByRoleId.do
 */
export function queryMenuTree(query) {
  return request({
    url: '/menu/menuTreeListByRoleId.do',
    method: 'post',
    params: query
  })
}

/**
 * 修改角色权限
 * @param roleId 角色ID
 * @param menuIds 类目数组
 * /menu/editMenuTreeListByRoleId.do
 */
export function editMenuTreePermission(data) {
  return request({
    url: '/menu/editMenuTreeListByRoleId.do',
    method: 'post',
    data
  })
}
