import request from '@/utils/request'

/**
 * 查询大牌任务列表
 * @param title 大牌任务标题 选填
 * @param page 查询第几页 必填 初始 1
 * @param limit 查询数据条数 必填 初始 10
 * /taskSpecialConfig/selectTaskSpecialConfigs.do
 */
export function queryTopMission(query) {
  return request({
    url: '/taskSpecialConfig/selectTaskSpecialConfigs.do',
    method: 'post',
    params: query
  })
}

/**
 * 查询新增任务列表
 * @param ids 新增的时候传该参数 0
 * @param page 查询第几页 必填 初始 1
 * @param limit 查询数据条数 必填 初始 10
 * /taskConfig/selectTaskConfigsBySpecialBizId.do
 */
export function queryTaskConfigsByBizId(query) {
  return request({
    url: '/taskConfig/selectTaskConfigsBySpecialBizId.do',
    method: 'post',
    params: query
  })
}

/**
 * 新增大牌任务
 * @param title 标题
 * @param description 任务描述
 * @param coverUrl 大牌任务封面
 * @param publicityUrl 大牌任务宣传图
 * @param taskIds 多个任务id用英文逗号分隔，比如1,2,3
 * @param sort 排序，从1开始
 * /taskSpecialConfig/add.do
 */
export function addTopMission(query) {
  return request({
    url: '/taskSpecialConfig/add.do',
    method: 'post',
    params: query
  })
}

/**
 * 修改大牌任务获取详情
 * @param id 大牌任务ID
 * /taskSpecialConfig/selectTaskSpecialConfigById.do
 */
export function editTopMission(query) {
  return request({
    url: '/taskSpecialConfig/selectTaskSpecialConfigById.do',
    method: 'post',
    params: query
  })
}

/**
 * 确认修改大牌任务
 * @param id
 * @param bizId 业务主键
 * @param title 标题
 * @param description 任务描述
 * @param coverUrl 大牌任务封面
 * @param publicityUrl 大牌任务宣传图
 * @param taskIds 多个任务id用英文逗号分隔，比如1,2,3
 * @param sort 排序，从1开始
 * /taskSpecialConfig/update.do
 */
export function updateTopMission(query) {
  return request({
    url: '/taskSpecialConfig/update.do',
    method: 'post',
    params: query
  })
}

/**
 * 删除大牌任务
 * @param id 大牌任务ID
 * /taskSpecialConfig/delete.do
 */
export function delTopMission(query) {
  return request({
    url: '/taskSpecialConfig/delete.do',
    method: 'post',
    params: query
  })
}
