import request from '@/utils/request'


//待开列表  待开列表查询
export function awaitListSearch(data) {
  return request({
    url: '/server/todo/page',
    method: 'post',
    data,
    headers:{
      showLoading:true
    }
  })
}

//待开列表  详情
export function awaitListDetail(data) {
  return request({
    url: '/server/todo/detail',
    method: 'get',
    params: data,
    headers: {
      showLoading: true
    }
  })
}


//待开列表  待开列表导出
export function awaitListExport(data) {
  return request({
    url: '/server/todo/export',
    method: 'post',
    data,
    headers:{
      showLoading:true
    },
    responseType: "blob",

  })
}


//待开列表  待开列表删除
export function awaitListDelete(data) {
  return request({
    url: '/server/todo/delete',
    method: 'delete',
    params:data,
    headers:{
      showLoading:true
    }
  })
}



//待开列表  待开列表单个开票
export function awaitListExecute(data) {
  return request({
    url: '/server/todo/execute',
    method: 'post',
    params: data,
    headers: {
      showLoading: false
    }
  })
}


//待开列表  获取待开号码
export function getInvoiceStatic(data) {
  return request({
    url: '/server/todo/getInvoiceStatic',
    method: 'post',
    params: data,
    headers: {
      showLoading: true
    }
  })
}

//待开清单批量  获取任务详情
export function getTaskConfig(data) {
  return request({
    url: '/server/taskConfig/detail',
    method: 'get',
    params: data,
    headers: {
      showLoading: false
    }
  })
}
//待开清单批量  新增开票任务
export function addTaskConfig(data) {
  return request({
    url: 'server/taskConfig/insert',
    method: 'post',
    data,
    headers: {
     
    }
  })
}
//待开清单批量  修改已读标识
export function updateRead(data) {
  return request({
    url: 'server/taskConfig/updateRead',
    method: 'put',
    params: data,
    headers: {
      
    }
  })
}
//待开清单批量  修改任务状态
export function updateStatus(data) {
  return request({
    url: '/server/taskConfig/updateStatus',
    method: 'put',
    params: data,
    headers: {
      
    }
  })
}