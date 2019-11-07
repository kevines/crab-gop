import request from '@/utils/request'

/**
 * 查询日志列表
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @param userId 用户id
 * @param action 操作
 * @param tableName 表名
 * @param detail 操作日志详细信息
 * @param ip 日志访问ip
 * @param bizId 业务主键
 * @param page 1
 * @param limit 10
 */
export function queryLog(query) {
  return request({
    url: '/sysActionLog/list.do',
    method: 'post',
    params: query
  })
}
