import request from '@/utils/request'

/**
 *首页统计
 * @param taskEarnings 任务收益
 * @param taskEarningsAverage 任务均利益
 * @param townsPartnerAverage 乡镇合伙人均收益
 * @param villageAverage 经济人均收益
 * @param taskCompletionNum 任务完成数量
 * @param taskCompletionRate 任务完成率
 * @param taskCompletionSum 人均完成任务数
 * @param taskInterestedNum 任务关注数
 * @param taskEarnings 任务收益
 * @param taskEarningsAverage 任务均利益
 * @param townsPartnerAverage 乡镇合伙人均收益
 * @param villageAverage 经济人均收益
 */
/**
 *查看单次任务数据
 */
export function queryTaskOnce(query) {
  return request({
    url: '/statistical/queryTaskOnce.do',
    method: 'post',
    params: query
  })
}
/**
 *查看单次任务数据
 */
export function queryTaskOnce1(query) {
  return request({
    url: '/statistical/queryTaskOnce1.do',
    method: 'post',
    params: query
  })
}
/**
 *查看单次任务收益数据
 */
export function queryEarningOnce(query) {
  return request({
    url: '/statistical/queryEarningsOnce.do',
    method: 'post',
    params: query
  })
}
/**
 *查看任务收益数据
 */
export function queryEarnings(query) {
  return request({
    url: '/statistical/queryEarnings.do',
    method: 'post',
    params: query
  })
}
/**
 *查看任务完成数据
 */
export function queryTask(query) {
  return request({
    url: '/statistical/queryTask.do',
    method: 'post',
    params: query
  })
}
/**
 *查看任务类目收益
 */
export function queryTaskCategory(query) {
  return request({
    url: '/statistical/queryTaskCategory.do',
    method: 'post',
    params: query
  })
}
/**
 *查看单次任务类目
 */
export function queryTaskCategoryOnce(query) {
  return request({
    url: '/statistical/queryTaskCategoryOnce.do',
    method: 'post',
    params: query
  })
}
