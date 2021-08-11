import request from '@/utils/request'

//获取已安装的打印机名称列表
export function getInstalledPrintersApi() {
  return request({
    url:'http://localhost:13769/Print/GetInstalledPrinters',
    method: 'get',
    headers:{
      showLoading:false
    },
  })
}
//普票/专票打印
export function PrintInvoiceApi(data) {
  return request({
    url:'http://localhost:13769/Print/PrintInvoice',
    method: 'post',
    data,
    headers:{
      showLoading:true
    },
  })
}

//小票批量打印
export function PrintTicketArray(data) {
  return request({
    url:'http://localhost:13769/Print/PrintTicketArray',
    method: 'post',
    data,
    headers:{
      showLoading:true
    },
  })
}

//小票-单张
export function PrintTicket(data) {
  return request({
    url:'http://localhost:13769/Print/PrintTicket',
    method: 'post',
    data,
    headers:{
      showLoading:true
    },
  })
}

//打印测试页
export function printTest(data) {
  return request({
    url:'http://localhost:13769/Print/PrintTest',
    method: 'post',
    data,
    headers:{
      showLoading:true
    },
  })
}

//打印小票测试页
export function ticketPrintTest(data) {
  return request({
    url:'http://localhost:13769/Print/TicketPrintTest',
    method: 'post',
    data,
    headers:{
      showLoading:true
    },
  })
}