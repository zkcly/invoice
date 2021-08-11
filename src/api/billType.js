import request from '@/utils/request'

//根据税盘信息获取票种类型
export function getDiskTicketType(params) {
      return request({
        url: '/company/companyDiskTicketType/getDiskTicketType',
        method: 'get',
        params,
        headers:{
          showLoading:true
        }
      })
}

//获取短信充值列表
export function getRechargeList(data) {
 return request({
   url: '/company/companyRechargeRecord/listByCompanyId',
   method: 'post',
   data,
   headers:{
     showLoading:true
   }
 })
}

//获取短信充值规格列表
export function getSpecifications() {
  return request({
    url: '/base/recharge/list',
    method: 'get',
    headers:{
      showLoading:false
    }
  })
 }

 //短信充值支付
export function smsCharge(data) {
  return request({
    url: '/company/companyRechargeRecord/smsCharge',
    method: 'post',
    data,
    headers: {
      // "Content-Type": "application/x-www-form-urlencoded",

    },
  })
 }

 //个人中心修改密码
 export function updatePassword(data) {
  return request({
    url: '/company/companyUser/updatePwd',
    method: 'put',
    params:data,
  })
 }

 //根据企业ID获取企业信息
 export function getCompanyInfoById(params) {
      return request({
        url: '/company/companyInfo/getCompanyInfoById',
        method: 'get',
        params,
        headers:{
          showLoading:true
        }
      })
}

//根据税盘号获取税盘信息
export function getTaxInfoById(data) {
      return request({
        url: `/company/taxDisk/getInfoByTaxDiskNum/${data}`,
        method: 'get',
  //       params,
        headers:{
          showLoading:false
        }
      })
}


 //查询所有更新通知
 export function getDayDate(data) {
      return request({
        url: '/base/clientMessage/listMessage',
        method: 'post',
        data,
        headers:{
          showLoading:true
        }
      })
}

//根据PDF生成二维码
export function downloadRqCode(params) {
      return request({
        url: '/server/invoiceInfo/downloadRqCode',
        method: 'get',
        params,
        headers:{
          showLoading:true
        }
      })
}

//根据流水号发送邮箱和短信
export function sendSmsAndEmail(params) {
      return request({
        url: '/server/invoiceInfo/sendSmsAndEmail',
        method: 'get',
        params,
        headers:{
          showLoading:true
        }
      })
}

//发票查询打印
export function getPrintInfo(data) {
      return request({
        url: '/server/invoiceInquiry/getPrintInfo',
        method: 'post',
        data,
        headers:{
          showLoading:true
        }
      })
}

//审核开票发票查询打印
export function getApplyPrintInfo(data) {
      return request({
        url: '/server/invoiceInquiry/getApplyPrintInfo',
        method: 'post',
        data,
        headers:{
          showLoading:true
        }
      })
}

