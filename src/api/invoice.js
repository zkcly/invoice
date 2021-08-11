import request from '@/utils/request'


// 首页
// 首页 开票统计 获取金额、税额、开票张数 （先默认查询库存列表）
export function getInvoiceStaticApi(data) {
    return request({
        url: '/server/invoiceBillingStatistics/getInvoiceStatic',
        method: 'post',
        params: data,
    })
}
// 首页 发票库存
export function invoiceInventoryApi(data) {
    return request({
        url: 'server/invoiceInventory/list',
        method: 'get',
        params: data,
    })
}


// 销项管理首页
// 获取菜单路由列表
export function listRouterApi(data) {
    return request({
        url: 'company/roleMenu/listRouter',
        method: 'get',
        params: data,
        headers: {
            showLoading: true
        }
    })
}

// 申领分发
// 根据税盘信息获取票种类型
export function getDiskTicketTypeApi(data) {
    return request({
        url: 'company/companyDiskTicketType/getDiskTicketType',
        method: 'get',
        params: data,
    })
}
// 发票申领状态查询
export function applyInvoiceStatusQueryAPi(data) {
    return request({
        url: '/server/invoicePurchase/applyInvoiceStatusQuery',
        method: 'post',
        data,
    })
}
// 删除申领
// export function deleteByIdApi(data) {
//     return request({
//         url: '/server/invoicePurchase/deleteById',
//         method: 'post',
//         params: data,
//         headers: {
//             showLoading: true
//         }
//     })
// }
// 申领查询
export function searchByCondition(data) {
    return request({
        url: 'server/invoicePurchase/searchByCondition',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}

// 分发查询
export function onlineApplyInvoice(data) {
    return request({
        url: 'server/invoicePurchase/onlineApplyInvoice',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}



// 撤销申领
export function cancelReceiveApi(data) {
    return request({
        url: '/server/invoicePurchase/cancelReceive',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}
//分发查询
export function Invoicequery(data) {
    return request({
        url: 'server/invoicePurchase/querySynchronization',
        method: 'post',
        data,
        headers: {
            showLoading: false
        }
    })
}
// 网上购票信息录入（网上购票分发，将申领发票分发到盘)
export function onlineApplyInvoiceApi(data) {
    return request({
        url: '/server/invoicePurchase/onlineApplyInvoice',
        method: 'post',
        data,
        headers: {
            showLoading: false
        }
    })
}

// 申领查询(分页)
export function searchByConditionApi(data) {
    return request({
        url: '/server/invoicePurchase/searchByCondition',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}

// 发票申领
// 发票申领准备信息查询
export function prepareInformationQueriesApi(data) {
    return request({
        url: 'server/invoicePurchase/prepareInformationQueries',
        method: 'post',
        data,
        headers: {
            showLoading: false
        }
    })
}
// 发票申领 
export function invoicePurchaseApi(data) {
    return request({
        url: 'server/invoicePurchase/invoiceApply',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}


//收件人设置
// 查询收件人信息列表
export function receivingListApi(data) {
    return request({
        url: 'server/receivingAddress/list',
        method: 'get',
        params: data,
        headers: {
            showLoading: false
        }
    })
}
export function receivingList(data) {
    return request({
        url: 'server/receivingAddress/listByCondition',
        method: 'post',
        data,
        headers: {
            showLoading: false
        }
    })
}

//根据ID获取收件人信息
export function getReceiveById(data) {
    return request({
        url: 'server/receivingAddress/getInfoById',
        method: 'get',
        params: data,
        headers: {
            showLoading: true
        }
    })
}
//查询缓存数据接口, 通过messageId查询
export function getMessageId(data) {
    return request({
        url: 'server/invoicePurchase/searchCoreResponse',
        method: 'post',
        params: data,
        headers: {
            showLoading: true
        }
    })
}


// 删除收件人信息
export function receivingDeleteApi(ids) {

    return request({
        url: `server/receivingAddress/delete?id=${ids}`,
        method: 'delete',
        data: ids
    })
}
// 编辑收件人信息
export function receivingEditApi(data) {
    return request({
        url: '/server/receivingAddress/edit',
        method: 'put',
        data,
        headers: {
            showLoading: true
        }
    })
}
// 新增收件人信息
export function insertApi(data) {
    return request({
        url: 'server/receivingAddress/insert',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}
// 根据条件查询收件人信息列表（分页）
export function listByConditionApi(data) {
    return request({
        url: 'server/receivingAddress/listByCondition',
        method: 'post',
        data,
        headers: {
            showLoading: false
        }
    })
}


//申领修改
export function EditInvoicePurchase(data) {
    return request({
        url: 'server/invoicePurchase/saveOrUpdate',
        method: 'post',
        data,
        headers: {
            showLoading: false
        }
    })
}


//根据msgId查询核心通信回调缓存
export  function  getRedis(data)  {
    return  request({
        url: '/server/redis/getRedis',
        method:   'get',
        params:  data,
        headers: {
            showLoading: true
        }
    })
}
//确认发票
export  function PaperConfirm(data)  {
    return  request({
        url: '/server/invoicePurchase/paperTicketConfirm',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}