import request from '@/utils/request'
import requestImage from '@/utils/requestTaxImage'
//审核开票页面----

//审核开票--查询审核开票的小程序二维码
// export function getWeChatQrCode(data) {
//   return request({
//     url: '/server/wx/getWeChatQrCode',
//     method: 'post',
//     params: data,
//     headers:{
//       showLoading:true
//     }
//   })
// }

//审核开票分页查询列表
export function applyListApi(data) {
  return request({
    url: '/server/apply/page',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

//审核开票分页查询详情
export function applyDetailApi(data) {
  return request({
    url: '/server/apply/detail',
    method: 'get',
    params: data,
    headers:{
      showLoading:true
    }
  })
}

//查看发票图片信息
export function getPdf(data) {
  return requestImage({
    url: '/server/invoiceInfo/createPdfAndImg',
    method: 'get',
    params: data,
    headers:{
      showLoading:true
    }
  })
}

//查询ofd文件地址
export function getOfd(data) {
      return request({
        url: '/server/invoiceInfo/selectOfd',
        method: 'get',
        params: data,
        headers:{
          showLoading:false
        }
      })
}

//审核开票  加入待开列表
export function applyaddTodoApi(data) {
  return request({
    url: `/server/apply/addTodo?applyId=${data}`,
    method: 'post',
    
    headers:{
      showLoading:true
    }
  })
}
//修改审核状态
export function updataStatusApi(data) {
  return request({
    url: '/server/apply/update/status',
    method: 'put',
    data,
    headers:{
      showLoading:true
    }
  })
}

//修改物流信息
export function updataExpress(data) {
  return request({
    url: '/server/apply/update/express',
    method: 'put',
    data,
    headers:{
      showLoading:true
    }
  })
}

//拉黑
export function insertApi(data) {
  return request({
    url: '/server/salesman/blacklist/insert',
    method: 'post',
    params: data,
    headers:{
      showLoading:true
    }
  })
}

// 开票申请打印
export function printApplyInvoice(data) {
  return request({
      url: 'http://localhost:13769/Print/PrintApplyInvoice',
      method: 'post',
      data,
      headers: {
          showLoading: true
      },
      // responseType: "blob",
  })
}


