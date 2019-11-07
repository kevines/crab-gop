import request from '@/utils/request'

/**
 * 交易类报表
 * @param page  页码
 * @param limit 行数
 * @param orderNo 订单号
 * @param tradeNo 交易号
 * @param goodsId 商品ID
 * @param orderStatus 订单状态
 * @param returnStatus 退款状态
 * @param payType 支付方式
 * @param sellerUserId 商家ID
 * @param buyerUserId 买家ID
 * @param startCreated  开始创建时间
 * @param endCreated 结束创建时间
 * @param startDoneTime 开始完成时间
 * @param endDoneTime 结束完成时间
 * @param buyerUserId 买家ID
 * @param doneTime 完成时间
 * @param gmtCreated  创建时间
 * @param number 商品数量
 * @param payTime 支付时间
 * @param saleCommissionFee 营销费率
 * @param returnAmount 退款金额
 * @param payAmount 实付金额
 * @param saleCommissionRate 营销费
 * @param settlementAmount 结算单价
 * @param settlementTotalAmount 结算金额
 * @param totalAmount 订单总金额
 * @param platformRate  总部分佣比例
 * @param platformRateCommission 总部分佣金额
 * @param platformRateUserId 总部分佣去向ID
 * @param joinPartnerRate 合伙人分佣比例
 * @param joinPartnerCommission 合伙人分佣金额
 * @param joinPartnerUserId 合伙人去向ID
 * @param townPartnerRate 乡镇分佣比例
 * @param townPartnerCommission 乡镇分佣金额
 * @param townPartnerUserId 乡镇去向ID
 */
/**
 *交易类报表列表
 */
export function queryStatement(query) {
  return request({
    url: '/orderSnapshot/list.do',
    method: 'post',
    params: query
  })
}
