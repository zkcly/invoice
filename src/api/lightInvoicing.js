import request from '@/utils/request'

//根据msgId查询核心通信回调缓存
export  function  getRedis(data)  {
  return  request({
      url:   '/server/redis/getRedis',
      method:   'get',
      params:  data,
      headers: {
          showLoading: true
      }
  })
}


//闪电开票 -- 发票类型
export function getInvoicingType(data) {
  return request({
    url: '/company/companyDiskTicketType/getDiskTicketType',
    method: 'get',
    params: data,
    headers:{
      showLoading:true
    }
  })
}

//闪电开票 -- 根据发票类型，获取发票基本数据
export function getInvoicingTypeDetail(data) {
  return request({
    url: '/server/invoiceInfo/getFastInvoiceInfo',
    method: 'post',
    params: data,
    headers:{
      showLoading:true
    }
  })
}


//闪电开票 -- 根据登录用户获取税盘列表！！！！！！！！！！
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
//闪电开票 -- 税盘详情--开票码！！！！！！！！！！
export function getInvoicingQR(data) {
  return request({
    url: '/company/taxDisk/getInfo/'+data,
    method: 'get',
    // params: data,
    headers:{
      showLoading:true
    }
  })
}


//闪电开票 -- 开票
export function lightInvoiceSubmit(data) {
  return request({
    url: '/server/invoiceInfo/fastInvoice',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}
//闪电开票 -- 保存 
export function lightInvoiceSave(data) {
  return request({
    url: '/server/invoiceInfo/saveTodo',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}




//闪电开票-购方信息-------------------------------

//组件- 客户导入 
export function importCustomer(data) {
  return request({
    url: '/server/invoiceBuyer/listPage',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

//组件- 客户导入   删除购买方
export function toDelete(data) {
  return request({
    url: '/server/invoiceBuyer/delete',
    method: 'post',
    params: data,
    headers:{
      showLoading:true
    }
  })
}

//组件- 客户导入  清空历史购买方
export function clearHistory(data) {
  return request({
    url: '/server/invoiceBuyer/clearHistory',
    method: 'post',
    params: data,
    headers:{
      showLoading:true
    }
  })
}


//组件- 选择客户 查询列表
export function queryCustomerList(data) {
  return request({
    url: '/server/invoiceBuyer/listPage',
    method: 'get',
    params: data,
    headers:{
      showLoading:true
    }
  })
}




//闪电开票-商品信息-------------------------------

//组件- 商品选择 列表
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


//组件- 商品列表 - 根据盘号获取常驻商品
export function residentDefault(data) {
  return request({
    url: '/company/companyGoods/selectResidentGoods',
    method: 'post',
    params: data,
    headers:{
      showLoading:true
    }
  })
}
//组件- 商品列表 - 设置常驻商品
export function setResident(data) {
  return request({
    url: '/company/companyGoods/resident',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}


//组件- 商品列表 - 商品智能赋码
export function autoCode(data) {
  return request({
    url: '/company/companyGoods/autoCode',
    method: 'post',
    params: data,
    headers:{
      showLoading:true
    }
  })
}
//组件- 商品列表 - 商品联想
export function lenovo(data) {
  return request({
    url: '/company/companyGoods/autoSelectGoods',
    method: 'get',
    params: data,
    headers:{
      showLoading:true
    }
  })
}





//闪电开票-销售方信息-------------------------------

// 获取销售方默认信息
export function getSellerDefaultData(data) {
  return request({
    url: '/company/sellerInfo/selectDefaultDisk/'+data,
    method: 'get',
    // params: data,
    headers:{
      showLoading:true
    }
  })
}

// 销售方信息查询
export function getSellerData(data) {
  return request({
    url: '/company/sellerInfo/list/'+data,
    method: 'get',
    // params: data,
    headers:{
      showLoading:true
    }
  })
}



// 企业用户登入信息！！！！！！
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






//闪电开票-组件- 客户选择 修改
export function modifyScanHistory(data) {
  return request({
    url: '/server/',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}


//闪电开票-组件- 客户联想框
export function customLenovo(data) {
  return request({
    url: '/customer/customerManagement/autoSelectCustomerList',
    method: 'post',
    params:data,
    headers:{
      showLoading:false
    }
  })
}

