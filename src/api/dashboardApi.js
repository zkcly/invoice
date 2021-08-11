import request from '@/utils/request'


//首页 开票统计
export function getInvoiceStaticApi(data) {
  return request({
    url: '/server/invoiceBillingStatistics/getInvoiceStatic',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}


//首页 发票库存
export function invoiceInventoryApi(data) {
  return request({
    url: '/server/invoiceInventory/indexStats',
    method: 'get',
    params:data,
    headers:{
      showLoading:true
    }
  })
}


//首页 发票监控数据
export function invoiceMonitorDataApi(data) {
  return request({
    url: '/server/invoiceMonitorData/list',
    method: 'get',
    params:data,
    headers:{
      showLoading:true
    }
  })
}

