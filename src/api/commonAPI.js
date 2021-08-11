import request from '@/utils/request'
import requestX from '@/utils/requestX'
// 盘税率查询
export function selectTaxRate(data) {
    return request({
      url: '/company/diskTaxRate/selectTaxRate',
      method: 'get',
      params: data,
      headers:{
        showLoading:true
      }
    })
  }


// 获取客户端信息
export function getClientInfo(data) {
    return request({
      url: '/base/client/getByCode?clientCode=dzgc',
      method: 'get',
      params: data,
      headers:{
        showLoading:true
      }
    })
  }


  // 消息中心 获取消息
export function getMessage(data) {
  return requestX({
    url: '/base/clientMessage/selectMessage',
    method: 'get',
    params:data,
    headers:{
    }
  })
}

// 消息中心 单条阅读
export function readSingleMessage(data) {
  return request({
    url: '/base/baseClientMessageRead/saveMessageRead',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}


// 消息中心 批量阅读
export function readMoreMessage(data) {
  return request({
    url: '/base/baseClientMessageRead/saveBatchMessageRead',
    method: 'get',
    params:data,
    headers:{
      showLoading:true
    }
  })
}


// 根据登录用户获取税盘列表
export function listByToken(data) {
    return request({
      url: '/company/taxDisk/listByToken',
      method: 'get',
      params: data,
      headers:{
        showLoading:true
      }
    })
  }

// 税盘详情
export function getInvoicingInfo(data) {
    return request({
      url: '/company/taxDisk/getInfo/'+data,
      method: 'get',
      // params: data,
      headers:{
        showLoading:true
      }
    })
  }


// 企业用户登入信息
export function getLoginData(data) {
    return request({
      url: '/company/companyUser/getLoginInfo',
      method: 'get',
      params: data,
      headers:{
        showLoading:true
      }
    })
  }

// 获取企业用户信息
export function getLoginUserByName(data) {
    return request({
      url: '/company/companyUser/getLoginUserByName',
      method: 'get',
      params: data,
      headers:{
        showLoading:true
      }
    })
  }


//下载操作手册
export function downOptBook(data) {
      return request({
        url: '/base/client/downloadHandbook',
        method: 'get',
        params: data,
        responseType: "blob",
        headers:{
          showLoading:true
        }
      })
}