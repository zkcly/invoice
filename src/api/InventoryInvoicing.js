import request from '@/utils/request'

//删除模板
export function delTemplate(data) {
 return request({
   url: '/server/invoiceListTemplate/deleteTemplate',
   method: 'delete',
   params: data
 })
}

//修改模板
export function updateTemplate(data) {
    return request({
      url: '/server/invoiceListTemplate/updateTemplate',
      method: 'put',
      params: data,
    })
   }

//查看模板详细
export function getDetailByTemplateId(data) {
 return request({
   url: '/server/invoiceListTemplateDetailed/getDetailByTemplateId',
   method: 'get',
   params: data,
   headers:{
     showLoading:true
   }
 })
}

//新增自定义明细字段
export function addTemplateDetail(data) {
  return request({
    url: '/server/invoiceListTemplateDetailed/insertDetail',
    method: 'post',
    data,
  })
 }

 //修改模板明细
export function updateTemplateDetail(data) {
  return request({
    url: '/server/invoiceListTemplateDetailed/updateDetail',
    method: 'put',
    params: data,
  })
 }

 //修改模板明细排序
export function updateSort(data) {
  return request({
    url: '/server/invoiceListTemplateDetailed/updateSort',
    method: 'put',
    params: data,
  })
 }

  //删除模板明细
export function deleteTemplateDetail(data) {
  return request({
    url: '/server/invoiceListTemplateDetailed/deleteDetail',
    method: 'delete',
    params: data,
  })
 }

 //导出模板
 export function downloadTemplate(data) {
  return request({
    url: '/server/invoiceListTemplateDetailed/downloadTemplate',
    method: 'get',
    params: data,
    responseType: 'blob',
    headers:{
      showLoading:true
    }
  })
 }