/**
 * 分页查询兑换券列表
 * @param {*} query 
 */
export function queryTicketList(query) {
    return request({
        url: '/exchange/ticket/page/list.do',
        method: 'get',
        params: query
    });
}

/**
 * 查询兑换券详情
 * @param {*} query 
 */
export function queryTicketDetail(query) {
    return request({
        url: '/exchange/ticket/detail.do',
        method: 'get',
        params: query
    });
}

/**
 * 批量生成兑换券功能
 * @param {*} query 
 */
export function createTicket(query) {
    return request({
        url: '/exchange/ticket/specification/create.do',
        method: 'post',
        params: query
    });
}