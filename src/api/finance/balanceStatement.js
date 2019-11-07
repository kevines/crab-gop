import request from '@/utils/request'

/**
 * 余额报表
 * @param userId  用户ID
 * @param phone 手机号
 * @param realName 真实姓名
 * @param amountBegin 期初总额
 * @param amountCharge 充值总额
 * @param page 页码
 * @param limit 行数
 * @param amountCommission 佣金总额
 * @param amountConsumption 消费总额
 * @param beginTime 期初时间
 * @param endTime 期末时间
 * @param amountEnd 期末总额
 * @param amountFrozen 冻结总额
 * @param amountTotal 贷款总额
 * @param amountWithdrawal 提现总额
 */
/**
 *余额列表
 */
export function queryBalance(query) {
  return request({
    url: '/appUser/queryAmountReport.do',
    method: 'post',
    params: query
  })
}
