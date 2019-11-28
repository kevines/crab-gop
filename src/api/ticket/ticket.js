import request from '@/utils/request'
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
 * 分页查询兑换券规格内容详情列表
 * @param {} query 
 */
export function queryTicketSpecificationList(query) {
    return request({
        url: '/exchange/ticket/specification/page/list.do',
        method: 'get',
        params: query
    });
}

export function queryTicketSpecificationDetail(query) {
    return request({
        url: '/exchange/ticket/specification/detail.do',
        method: 'get',
        params: query
    });
}

/**
 * 查询兑换券名称下拉列表
 * @param {*} query 
 */
export function queryTicketNameSelectList(query) {
    return request({
        url: '/exchange/ticket/specification/select/list.do',
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

/**
 * 更新兑换券信息
 * @param {*} query 
 */
export function eidtTicket(query) {
    return request({
        url: '/exchange/ticket/specification/edit.do',
        method: 'post',
        params: query
    });
}

/**
 * 删除兑换券
 * @param {} query 
 */
export function deleteTicketSpecification(query) {
    return request({
        url: '/exchange/ticket/specification/delete.do',
        method: 'post',
        params: query
    });
}

/**
 * 查询已兑换的蟹券列表
 */
export function queryConvertedTicketList(query) {
    return request({
        url: '/exchange/ticket/record/page/list.do',
        method: 'get',
        params: query
    });
}