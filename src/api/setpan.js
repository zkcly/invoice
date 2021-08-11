import request from '@/utils/request'

// 初始设置

// 初始设置 企业设置
// 获取公司行业类型数据
export function getCompanyIndustryTypeApi(data) {
  return request({
    url: 'company/companyInfo/getCompanyIndustryType',
    method: 'get',
    params: data,
    headers: {
      showLoading: false
    }
  })
}
// 获取所有省
export function getProvinceListApi(data) {
  return request({
    url: '/system/sysArea/getProvinceList',
    method: 'get',
    params: data,
    headers: {
      showLoading: false
    }
  })
}
// 根据父类编号获取下级市、区 {pareCode}
export function getCityListApi(data) {
  return request({
    url: '/system/sysArea/getCityList/' + data,
    method: 'get',
    headers: {
      showLoading: false
    }
  })
}
// 修改企业信息 初始化企业信息
export function companyInfoApi(data) {
  return request({
    url: '/company/companyInfo/update',
    method: 'post',
    data,
    headers: {
      showLoading: true
    }
  })
}

// 初始化-企业信息
export function companyInfoInit(data) {
  return request({
    url: '/company/companyInfo/init',
    method: 'post',
    data,
    headers: {
      showLoading: true
    }
  })
}

// 初始设置 税盘设置
// 根据登录用户获取税盘列表
export function listByTokenApi(data) {
  return request({
    url: '/company/taxDisk/listByToken',
    method: 'get',
    params: data,
    headers: {
      showLoading: true
    }
  })
}
// 初始化-税盘设置
export function addApanApi(data) {
  return request({
    url: '/company/taxDisk/add',
    method: 'post',
    data,
    headers: {
      showLoading: true
    }
  })
}

// 初始设置-新增税盘
export function addApanBySetting(data) {
  return request({
    url: '/company/taxDisk/addBySetting',
    method: 'post',
    data,
    headers: {
      showLoading: true
    }
  })
}
// 根据id删除税盘
export function taxDiskIdApi(data) {
  return request({
    url: 'company/taxDisk/delById/' + data,
    method: 'get',
    headers: {
      showLoading: true
    }
  })
}
// 修改税盘
export function taxDiskEditApi(data) {
  return request({
    url: '/company/taxDisk/edit',
    method: 'post',
    data,
    headers: {
      showLoading: true
    }
  })
}

// 初始设置 销方设置
// 销方信息查询
export function listXiaoApi(data) {
  return request({
    url: 'company/sellerInfo/list/' + data,
    method: 'get',
    headers: {
      showLoading: true
    }
  })
}
// 新增销方信息
export function addXiaoApi(data) {
  return request({
    url: '/company/sellerInfo/add',
    method: 'post',
    data,
    headers: {
      showLoading: true
    }
  })
}
// 修改销方信息
export function editXiaoApi(data) {
  return request({
    url: '/company/sellerInfo/edit',
    method: 'post',
    data,
    headers: {
      showLoading: true
    }
  })
}
//  删除销方信息
export function deleteXiaoApi(data) {
  return request({
    // `server/receivingAddress/delete?id=${ids}`
    url: `/company/sellerInfo/delete?id=${data} `,
    method: 'post',
    data,
    headers: {
      showLoading: true
    }
  })
}
// 设为默认
export function defXiaoApi(data) {
  return request({
    url: `company/sellerInfo/def?id=${data.id}&taxDiskNum=${data.taxDiskNum} `,
    method: 'post',
    data,
    headers: {
      showLoading: true
    }
  })
}

//参数设置
//详情
export function taxDiskNumDetailsApi(data) {
  return request({
    url: '/company/taxDisk/getInfoByTaxDiskNum/' + data,
    method: 'get',
    headers: {
      showLoading: true
    }
  })
}
// 修改
export function saveTaxDiskNumApi(data) {
  return request({
    url: '/company/taxDisk/edit',
    method: 'post',
    data,
    headers: {
      showLoading: true
    }
  })
}
