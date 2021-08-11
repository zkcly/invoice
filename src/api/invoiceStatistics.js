
import request from '@/utils/request'

//根据税盘信息获取票种类型
export function getDiskTicketType(params) {
    return request({
      url: '/company/companyDiskTicketType/getDiskTicketType',
      method: 'get',
      params,
      headers:{
        showLoading:true
      }
    })
  }

  //开票统计-发票汇总表
  export function getStatistics(data) {
    return request({
    url: '/server/invoiceBillingStatistics/getStatistics',
    method: 'post',
    data,
    headers:{
        showLoading:true
    }
    })
}

//开票统计-发票清单
export function getStatisticsList(data) {
    return request({
    url: '/server/invoiceBillingStatistics/getStatisticsList',
    method: 'post',
    data,
    headers:{
        showLoading:true
    }
    })
}

//查询发票监控数据列表
export function getInvoiceMonitorData(params) {
    return request({
      url: '/server/invoiceMonitorData/list',
      method: 'get',
      params,
      headers:{
        showLoading:true
      }
    })
  }

  //汇总列表数据查询
  export function getSummaryUploadList(params) {
    return request({
      url: '/server/invoiceSummaryUpload/list',
      method: 'get',
      params,
      headers:{
        showLoading:true
      }
    })
  }

  //开票统计清单导出
  export function exportStatistics(data) {
    return request({
      url: '/server/invoiceBillingStatistics/export',
      method: 'post',
      data,
      headers:{
        showLoading:true
      },
      responseType: "blob",
    })
  }
  //开票统计汇总导出
  export function exportStatisticsPdf(data) {
    return request({
      url: '/server/invoiceBillingStatistics/exportPdf',
      method: 'post',
      data,
      headers:{
        showLoading:true
      },
      responseType: "blob",
    })
  }

//发票上传
export function invoiceUpload(params) {
  return request({
    url: '/server/invoiceInquiry/invoiceUploaded',
    method: 'get',
    params,
    headers:{
      showLoading:false
    }
  })
}

//上报汇总
export function invoiceCopyAndReport(params) {
  return request({
    url: '/server/invoiceSummaryUpload/invoiceCopyAndReport',
    method: 'get',
    params,
    headers:{
      showLoading:false
    }
  })
}

//发票反写
export function invoiceReverseWriting(params) {
  return request({
    url: '/server/invoiceSummaryUpload/invoiceReverseWriting',
    method: 'get',
    params,
    headers:{
      showLoading:false
    }
  })
}


//空白作废-查询页面
export function getBlankInvoice(data) {
    return request({
      url: '/server/invoiceInfo/getBlankInvoiceAsy',
      method: 'post',
      params:data,
      headers:{
        showLoading:true
      }
    })
   }
//空白作废-作废
export function invalidBlankInvoice(data) {
  return request({
    url: '/server/invoiceInfo/invalidBlankInvoice',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
 }
 

  //根据msgId查询空白作废核心通信回调缓存
export function getBlankRedisList(data) {
  return request({
    url: '/server/redis/getBlankInvoiceRedisList',
    method: 'post',
   //  params: data,
    data,
    headers:{
      showLoading:true
    }
  })
 }

 // 发票汇总打印
export function printInvoiceStatistical(data) {
  return request({
      url: 'http://localhost:13769/Print/PrintInvoiceStatistical',
      method: 'post',
      data,
      headers: {
          showLoading: true
      },
      // responseType: "blob",
  })
}

// 发票清单汇总打印
export function PrintStatistical(data) {
  return request({
      url: 'http://localhost:13769/Print/PrintStatistical',
      method: 'post',
      data,
      headers: {
          showLoading: true
      },
      // responseType: "blob",
  })
}
