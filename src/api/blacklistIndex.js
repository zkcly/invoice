import request from '@/utils/request'
//黑名单列表页面

//获取业务人员（黑名单）分页列表
export function blackListApi(data) {
  return request({
    url: '/server/salesman/page',
    method: 'post',
    data,
    headers:{
      showLoading:false
    }
  })
}
//移除黑名单
export function deleteBlackApi(ids) {
  return request({
    url: '/server/salesman/blacklist/delete',
    method: 'delete',
    params: ids,
    headers:{
      showLoading:true
    }
  })
}
