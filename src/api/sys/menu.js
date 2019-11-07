import request from '@/utils/request'

/**
 * 查询类目列表
 * /menu/list.do
 */
export function queryMenu(query) {
  return request({
    url: '/menu/list.do',
    method: 'post',
    params: query
  })
}

/**
 * 新增类目
 * @param levels 一级 1 二级 2
 * @param name 商品标题 选填
 * @param url Url地址  新增一级类目 传#
 * @param pcode 父级类目code 新增一级类目 传空
 * /menu/addItem.do
 */
export function addMenu(query) {
  return request({
    url: '/menu/addItem.do',
    method: 'post',
    params: query
  })
}

/**
 * 编辑类目
 * @param menuId 类目ID
 * @param name 商品标题 选填
 * @param url Url地址  修改一级类目 传#
 * @param code 类目code
 * @param pcode 父级类目code 修改一级类目 传空
 * /menu/edit.do
 */
export function editMenu(query) {
  return request({
    url: '/menu/edit.do',
    method: 'post',
    params: query
  })
}

/**
 * 删除类目
 * @param menuId 角色ID
 * /menu/delete.do
 */
export function delMenu(query) {
  return request({
    url: '/menu/delete.do',
    method: 'post',
    params: query
  })
}
