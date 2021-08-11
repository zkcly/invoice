import request from '@/utils/request'
import requestTaxImage from '@/utils/requestTaxImage'


//红字信息 查询
export function redLetterListSearch(data) {
  return request({
    url: '/server/redInfoTab/page',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

//红字信息 明细详情
export function getDetailsById(data) {
  return request({
    url: '/server/redInfoTab/getDetailsById',
    method: 'get',
    params:data,
    headers:{
      showLoading:true
    }
  })
}


//红字信息 撤销
export function redLetterRevoke(data) {
  return request({
    url: '/server/redInfoTab/redInfoTabRevoke',
    method: 'post',
    data,
    headers:{
      showLoading:false
    }
  })
}

//红字信息 导出
export function redLetterExport(data) {
  return request({
    url: '/server/redInfoTab/export',
    method: 'post',
    data,
    headers:{
      showLoading:true
    },
    responseType: "blob",
  })
}


//红字信息 打印
export function redLetterPrint(data) {
  return request({
    url: '/server/redInfoTab/redInfoPrint',
    method: 'post',
    data,
    headers:{
      showLoading:true
    },
  })
}

// 打印
export function printRedInformationTable(data) {
  return request({
      url: 'http://localhost:13769/Print/PrintRedInformationTableArray',
      method: 'post',
      data,
      headers: {
          showLoading: true
      },
      // responseType: "blob",
  })
}

//红字信息 上传
export function redLetterUpload(data) {
  return request({
    url: '/server/redInfoTab/redTableUpload',
    method: 'post',
    data,
    headers:{
      showLoading:false
    }
  })
}


//红字信息 下载
export function redInfoTabDownload(data) {
  return request({
    url: '/server/redInfoTab/redInfoTabDownload',
    method: 'post',
    data,
    headers:{
      showLoading:false
    }
  })
}


//红字信息 删除
export function redInfoTabDelete(data) {
  return request({
    url: '/server/redInfoTab/delete',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

// 税率list获取
export function getTaxRateList(data) {
  return request({
    url: '/company/diskTaxRate/selectTaxRate',
    method: 'get',
    params:data,
    headers:{
      showLoading:true
    }
  })
}

//红字信息获取蓝字发票详情
export function getInvoiceInfo(data) {
  return request({
    url: '/server/invoiceInfo/getInvoiceInfo',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

//红字信息获取蓝字发票详情
export function getInvoiceInfo1(data) {
  return requestTaxImage({
    url: '/server/invoiceInfo/getInvoiceInfo',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}
