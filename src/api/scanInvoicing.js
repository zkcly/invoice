import request from '@/utils/request'

//扫码开票页面----

//扫码开票 -- 新增扫码开票记录(添加接口)
export function addScanInvoice(data) {
  return request({
    url: '/server/invoiceTickets/tickets',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

//扫码开票 -- 打印
export function ticketPrint(data) {
  return request({
    url: '/server/invoiceTickets/ticketPrint',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

// 扫码开票---根据所属税盘获取小票设置信息
export function setInfo(data) {
 return request({
   url: '/server/invoiceTicketSetup/getSetupByCompany/'+data,
   method: 'get',
  //  data,
   headers:{
     showLoading:true
   }
 })
}




//扫码开票-设置 查询列表-------------------------------
export function getScanSet(data) {
  return request({
    url: '/server/invoiceTicketSetup/getSetupByCompany/'+data,
    method: 'get',
    // params: '',
    headers:{
      showLoading:true
    }
  })
}

//扫码开票-设置 保存
export function saveScanSet(data) {
  return request({
    url: '/server/invoiceTicketSetup/saveOrUpdate',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}


//扫码开票-历史页 查询列表-------------------------------
export function queryScanHistory(data) {
  return request({
    url: '/server/invoiceTickets/page',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

//扫码开票-历史页 删除列表
export function delScanHistory(data) {
  return request({
    url: '/server/invoiceTickets/delTickets',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

//扫码开票-历史页 打印列表
export function printScanHistory(data) {
  return request({
    url: '/',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

// 扫码开票-历史打印
export function historyPrint(data) {
  return request({
    url:'/server/invoiceTickets/historyPrint',
    method: 'post',
    data,
    headers:{
      showLoading:true
    },
  })
}

//扫码开票-历史页 重发列表--发送短信
export function resendScanHistory(data) {
  return request({
    url: '/server/invoiceTickets/sendMessage',
    method: 'get',
    params: data,
    headers:{
      showLoading:true
    }
  })
}


//扫码开票-历史页 作废
export function voidScanHistory(data) {
  return request({
    url: '/server/invoiceTickets/cancelTickets',
    method: 'get',
    params: data,
    headers:{
      showLoading:true
    }
  })
}

//扫码开票-历史页 重新生成
export function regenerateScanHistory(data) {
  return request({
    url: '/server/invoiceTickets/regenerateTickets',
    method: 'get',
    params: data,
    headers:{
      showLoading:true
    }
  })
}
//扫码开票-历史页 修改小票推送信息
export function updatePush(data) {
  return request({
    url: '/server/invoiceTickets/updatePush',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

//扫码开票-历史页 查看-- 
export function viewScanHistory(data) {
  return request({
    url: '/server/invoiceTickets/getInvoiceImg',
    method: 'get',
    params: data,
    headers:{
      showLoading:true
    }
  })
}


//扫码开票-历史页 修改
export function modifyScanHistory(data) {
  return request({
    url: '/server/invoiceTickets/updateTickets',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

//扫码开票-历史页 -- 根据小票流水号查看发票详情
export function viewInvoiceDetail(data) {
  return request({
    url: '/server/invoiceTickets/getById/'+data,
    method: 'get',
    // params: '',
    headers:{
      showLoading:true
    }
  })
}
