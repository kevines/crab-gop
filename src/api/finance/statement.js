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
/**
 *获取订单状态
 */
export function queryOrderType(query) {
  return request({
    url: '/order/orderType.do',
    method: 'post',
    params: query
  })
}
/**
 *获取售后状态
 */
export function queryAfterSaleType(query) {
  return request({
    url: '/order/returnDetail.do',
    method: 'post',
    params: query
  })
}
/**
 *获取支付方式
 */
export function queryPayType(query) {
  return request({
    url: '/order/payType.do',
    method: 'post',
    params: query
  })
}
/**
 *获取类目列表
 */
export function queryCategoryType(query) {
  return request({
    url: '/itemCategory/list.do?page=1&limit=10',
    method: 'post',
    params: query
  })
}
/**
 * 任务类报表
 * @param page  页码
 * @param limit 行数
 * @param taskDoBizId 执行任务编号
 * @param tradeBizId 交易号
 * @param configBizId 任务编号
 * @param status 任务状态
 * @param returnStatus 退款状态
 * @param payType 支付方式
 * @param sellerUserId 商家用户编号
 * @param joinPartner 执行合伙人ID
 * @param overTimeBegin  查询任务执行时间开始时间
 * @param overTimeEnd 查询任务执行时间结束时间
 * @param gmtPayBegin 查询佣金支付开始时间
 * @param gmtPayEnd 查询佣金支付结束时间
 * @param categoryStr 任务类目
 * @param statusStr 任务状态
 * @param sellerUserId  商家编号
 * @param joinPartner 执行合伙人编号
 * @param taskFee 任务佣金（元）
 * @param payAmount 实付任务佣金（元）
 * @param platformRate  总部分佣比例
 * @param platformRateCommission 总部分佣金额
 * @param platformRateUserId 总部分佣去向ID
 * @param joinPartnerRate 合伙人分佣比例
 * @param joinPartnerCommission 合伙人分佣金额
 * @param joinPartnerUserId 合伙人去向ID
 * @param townPartnerRate 乡镇分佣比例
 * @param townPartnerCommission 乡镇分佣金额
 * @param townPartnerUserId 乡镇去向ID
 * @param rate 其他角色比例
 * @param commission 其他角色分佣金额（元）
 * @param userId 其他角色分佣去向编号
 * @param doTime 任务执行时间
 * @param gmtPayTime 佣金支付时间
 * @param overTime 任务完成时间
 * @param payType 佣金支付方式
 */
/**
 *任务类报表列表
 */
export function queryTaskStatement(query) {
  return request({
    url: '/taskDo/financialTaskReport.do',
    method: 'post',
    params: query
  })
}

