import request from '@/utils/request'


//智能报销 -- 1查询智能报销是否开通
export function verification(data) {
  return request({
    url: '/server/smartReimbursement/verification',
    method: 'post',
    params: data,
    headers:{
      showLoading:true
    }
  })
}


//智能报销 -- 2查询是否已验证激活该功能
export function checkActivated(data) {
  return request({
    url: '/server/smartReimbursement/checkActivated',
    method: 'post',
    params: data,
    headers:{
      showLoading:true
    }
  })
}


//智能报销 -- 3获取uuid
export function getSmartUUID(data) {
  return request({
    url: '/server/smartReimbursement/createSmartReimbursementTokenByPC',
    method: 'post',
    params: data,
    headers:{
      showLoading:true
    }
  })
}


export function caishui(data) {
  return request({
    url: '/company/companyInfo/caishui/userInfo ',
    method: 'get',
    headers:{
      showLoading:true
    }
  })
}

export function StartoverBookkeeping(data) {
  return request({
    url: 'http://localhost:13769/Module/StartoverBookkeeping',
    method: 'Post',
    data,
    headers:{
      showLoading:false
    }
  })
}



