import request from '@/utils/request'

/**
 * 支出管理
 * @param userId  用户ID
 * @param phone 手机号
 * @param realName 真实姓名
 * @param applyType 提现状态
 * @param type 提现类型
 * @param page 页码
 * @param limit 行数
 * @param applyStates 申请状态
 * @param withdrawStates 提现状态
 * @param gmtModified 支出时间
 * @param withdrawTime 确认时间
 * @param bankBranchName 支行
 * @param bankName 开户行
 * @param bankNo 银行卡号、支付宝微信
 * @param countyName 开户行所在省市
 */
/**
 *余额列表
 */
export function queryDisbure(query) {
  return request({
    url: '/withdrawApply/list.do',
    method: 'post',
    params: query
  })
}
/**
 *拒绝提现
 */
export function refuse(query) {
  return request({
    url: '/withdrawApply/refused.do',
    method: 'post',
    params: query
  })
}
/**
 *拒绝提现
 */
export function agree(query) {
  return request({
    url: '/withdrawApply/agreed.do',
    method: 'post',
    params: query
  })
}
