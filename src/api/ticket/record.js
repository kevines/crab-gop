/**
 * 分页查询蟹券交易记录列表
 * @param {} query 
 */
export function queryTicketRecordList(query) {
    return request({
        url: '/exchange/ticket/record/page/list.do',
        method: 'get',
        params: query
    });
}

/**
 * 查询蟹券交易详情
 * @param {*} query 
 */
export function queryTicketRecordDetail(query) {
    return request({
        url: '/exchange/ticket/record/detail.do',
        method: 'get',
        params: query
    });
}

/**
 * 发货
 * @param {*} query 
 */
export function sendTicketGood(query) {
    return request({
        url: '/exchange/ticket/record/send.do',
        method: 'post',
        params: query
    });
}

/**
 * 撤销发货
 * @param {*} query 
 */
export function cancelSendTicketGood(query) {
    return request({
        url: '/exchange/ticket/record/cancel/send.do',
        method: 'post',
        params: query
    });
}

