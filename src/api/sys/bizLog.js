import request from '@/utils/request'

/**
 * 分页查询充值记录
 * @param countyCode 县域code 选填
 * @param name 用户昵称 选填
 * @param phone 手机号 选填
 * @param roleCode 用户角色 选填
 * @param pageNo 查询第几页 必填 初始 1
 * @param pageSzie 查询数据条数 必填 初始 10
 */
export function queryBizLogListRequest(query) {
  return request({
    url: '/bizLog/list.do',
    method: 'post',
    params: query
  })
}

/**
 *
 * @param 保存 query
 */
export function detailRequest(data) {
  return request({
    url: '/accountChargeOrder/detail.do',
    method: 'post',
    data
  })
}

