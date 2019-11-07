import request from '@/utils/request'

/**
 * 余额查询
 * @param userId  用户ID
 * @param phone 手机号
 * @param realName 真实姓名
 * @param gmtCreated 创建时间
 * @param bigAmount 最大余额
 * @param smallAmount 最小余额
 * @param page 页码
 * @param limit 行数
 * @param amount 余额
 * @param bizId 业务主键
 */
/**
 *余额列表
 */
export function queryBalance(query) {
  return request({
    url: '/appUser/amountQuery.do',
    method: 'post',
    params: query
  })
}
/**
 * 余额详情
 * @param balanceAmount  账户余额
 * @param changeType 类型
 * @param flowNo 交易编号
 * @param gmtCreated 创建时间
 * @param mark 备注
 * @param tradeAmount 交易金额
 * @param page 页码
 * @param limit 行数
 * @param changeTypeName 类型名称
 * @param userId 用户ID
 * @param startCreated 开始时间
 * @param endCreated 结束时间
 */
/**
 *查看余额详情
 */
export function queryBalanceDetail(query) {
  return request({
    url: '/paymentFlow/list.do',
    method: 'post',
    params: query
  })
}
/**
 * 余额详情类型列表
 * @param id  类型ID
 * @param name 类型名称
 */
/**
 *类型列表
 */
export function queryChangeType(query) {
  return request({
    url: '/paymentFlow/changeType.do',
    method: 'post',
    params: query
  })
}
/**
 * 余额详情
 * @param tradeNo  交易编号
 * @param orderNo 订单编号
 * @param goodsId 交易号
 * @param gmtCreated 下单时间
 * @param payTime 支付时间
 * @param user 商品名称
 * @param picUrl 商品宣传图片
 * @param specificationValue 商品规格
 * @param settlementAmount 单价
 * @param number 数量
 * @param payAmount 实付金额
 * @param orderStatus 订单状态
 * @param buyerUserId  买家
 * @param sellerUserId 所属商家
 * @param saleCommissionFee 订单分佣
 * @param platformRate 总部分佣比例
 * @param joinPartnerRate 执行合伙人分佣比例
 * @param townPartnerRate 乡镇分佣比例
 * @param settlementTotalAmount 商家金额
 * @param platformRateCommission 总部分佣
 * @param joinPartnerCommission 执行合伙人分佣
 * @param townPartnerCommission 乡镇分佣
 * @param payAmount 实付金额
 * @param orderStatus 订单状态
 * @param sellerUserId 商家ID
 * @param joinPartnerUserId 执行合伙人ID
 * @param townPartnerUserId 乡镇ID
 * @param platformRateUserId 平台ID
 */
/**
 *通过交易编号查看订单详情
 */
export function queryOrderDetail(query) {
  return request({
    url: '/orderSnapshot/detail.do',
    method: 'post',
    params: query
  })
}

