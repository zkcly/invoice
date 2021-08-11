import request from '@/utils/request'
//发票查询
export function InvoiceList(data) {
    return request({
        url: '/server/invoiceInquiry/list',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}


//发票生成图片
export function createPdfAndImg(data) {
  return request({
      url: '/server/invoiceInfo/createPdfAndImg',
      method: 'get',
      params:data,
      headers: {
          showLoading: true
      }
  })
}

//发票修复
export function invoiceRepair(data) {
  return request({
      url: '/server/invoiceInquiry/invoiceRepair',
      method: 'post',
      data,
      headers: {
          showLoading: false
      }
  })
}


//发票作废
export function invoiceAbolish(data) {
  return request({
      url: '/server/invoiceInquiry/invoiceAbolish',
      method: 'post',
      data,
      headers: {
          showLoading: false
      }
  })
}


//发票上传税局
export function invoiceUploaded(data) {
  return request({
      url: '/server/invoiceInquiry/invoiceUploaded',
      method: 'get',
      params:data,
      headers: {
          showLoading: false
      }
  })
}


// 发票查询导出
export function invoiceExport(data) {
  return request({
      url: '/server/invoiceInquiry/export',
      method: 'post',
      data,
      headers: {
          showLoading: true
      },
      responseType: "blob",
  })
}

//发票  查详情
export function invoiceDetail(data) {
  return request({
      url: '/server/invoiceTickets/getById/'+data,
      method: 'get',
      headers: {
          showLoading: true
      }
  })
}



//发票下载
export function invoiceZipDownload(data) {
  return request({
      url: '/server/invoiceInquiry/zip',
      method: 'post',
      data,
      headers: {
          showLoading: true,
          'Content-Type': 'application/json; application/octet-stream'
      },
      responseType: "arraybuffer",
  })
}


//发票查询  未上传数目
export function getNotUploadNum(data) {
  return request({
      url: '/server/invoiceNotUploaded/getNotUpload',
      method: 'get',
      params:data,
      headers: {
          showLoading: true
      }
  })
}


//发票查询  同步未上传的数据到库中
export function invoiceNotUploaded(data) {
  return request({
      url: '/server/invoiceNotUploaded/invoiceNotUploaded',
      method: 'get',
      params:data,
      headers: {
          showLoading: false
      }
  })
}


//发票查询  ----打印 
export function getPrintInfo(data) {
  return request({
      url: '/server/invoiceInquiry/getPrintInfo',
      method: 'post',
      data,
      headers: {
          showLoading: true
      }
  })
}


//发票查询  ----清单打印
export function getListingPrintInfo(data) {
  return request({
      url: '/server/invoiceInquiry/getListingPrintInfo',
      method: 'post',
      data,
      headers: {
          showLoading: true
      }
  })
}

// 普票/专票打印
export function invoicePrint(data) {
  return request({
      url: 'http://localhost:13769/Print/PrintInvoice',
      method: 'post',
      data,
      headers: {
          showLoading: true
      },
      // responseType: "blob",
  })
}

// 清单打印打印
export function invoiceOrderPrint(data) {
  return request({
      url: 'http://localhost:13769/Print/PrintGoodsDetailArray',
      method: 'post',
      data,
      headers: {
          showLoading: true
      },
      // responseType: "blob",
  })
}
