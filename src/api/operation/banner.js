import request from '@/utils/request'
/**
 * banner广告管理
 * @param title  广告名称
 * @param imgUrl 图片
 * @param creator 发布人
 * @param status 状态
 */
/**
 * 获取banner列表数据
 */
export function queryBanner(query) {
  return request({
    url: '/banner/list.do',
    method: 'post',
    params: query
  })
}
/**
 * 新增banner
 */
export function addBanner(query) {
  return request({
    url: '/banner/addItem.do',
    method: 'post',
    params: query
  })
}
/**
 * 修改banner
 */
export function editBanner(query) {
  return request({
    url: '/banner/editItem.do',
    method: 'post',
    params: query
  })
}
/**
 * 删除banner
 */
export function deleteBanner(query) {
  return request({
    url: '/banner/delete.do',
    method: 'post',
    params: query
  })
}
