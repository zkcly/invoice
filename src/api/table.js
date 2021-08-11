import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/product/queryInfo',
    method: 'get',
    params,
    headers:{
      showLoading:true
    }
  })
}

//请求企业用户列表
export function getUserList(data) {
 return request({
   url: '/company/companyUser/page',
   method: 'post',
   data,
   headers:{
     showLoading:true
   }
 })
}

//新增企业用户
export function insertUser(data) {
  return request({
    url: '/company/companyUser/insert',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
 }

//修改企业用户
export function updateUser(data) {
 return request({
   url: '/company/companyUser/update',
   method: 'put',
   data,
   headers:{
     showLoading:true
   }
 })
}

//删除企业用户
export function deleteUser(ids) {
 return request({
   url: `/company/companyUser/delete?companyUserId=${ids.companyUserId}`,
   method: 'delete',
   data: ids
 })
}

//修改密码
export function updatePassword(data) {
  return request({ 
    url: `/company/companyUser/resetPwd?password=${data.password}&companyUserId=${data.companyUserId}`,
    method: 'put',
    data,
    headers:{
      showLoading:true
    }
  })
 }

 //根据企业用户ID获取税盘号列表
export function getListNumById(data) {
 return request({
   url: '/company/companyUserTaxDisk/listNumByUserId',
   method: 'get',
   params: data,
   headers:{
     showLoading:true
   }
 })
}

//根据登录用户获取税盘列表
export function getListNumByToken(data) {
 return request({
   url: '/company/taxDisk/listByToken',
   method: 'get',
   params: data,
   headers:{
     showLoading:true
   }
 })
}