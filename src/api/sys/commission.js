import request from '@/utils/request'

/**
 * 分佣管理
 * @param goodsId 商品ID
 * @param partnerRate 发展合伙人分佣
 * @param platChange 平台服务费
 * @param thirdLevel 执行人分佣
 * @param town 乡镇分佣
 */
/**
 *查询
 */
export function queryCommission(query) {
  return request({
    url: '/itemGoodsCommission/detail.do',
    method: 'post',
    params: query
  })
}
/**
 * 更新分佣配置
 */
export function updateCommission(query) {
  return request({
    url: '/itemGoodsCommission/editItem.do',
    method: 'post',
    params: query
  })
}
