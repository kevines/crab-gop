import request from '@/utils/request'

/**
 * 流水报表
 * @param flowNo 订单编号
 * @param userId 用户ID
 * @param goodsId 商品ID
 * @param startCreated 开始创建时间
 * @param endCreated 结束创建时间
 * @param startPayTime 开始支付时间
 * @param endPayTime 结束支付时间
 * @param bizId 交易号/流水号
 * @param gmtCreated  完成时间
 * @param payTime 支付时间
 * @param toUserId 分佣去向
 * @param totalAmout 订单金额/支付任务佣金金额
 * @param tradeAmount 交易金额
 * @param userName 用户身份
 */
/**
 *流水报表
 */
export function queryWaterReport(query) {
  return request({
    url: '/paymentFlow/trport.do',
    method: 'post',
    params: query
  })
}
