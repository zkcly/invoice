import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/loginByCompany',
    method: 'post',
    data,
    headers: {
      showLoading: true,
      isloginApi:true
    }
  })
}



export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function companyDiskRegistrationCode(data) {
  return request({
    url: '/company/companyDiskRegistrationCode/create',
    method: 'get',
    params: data,
  })
}

export function companyDiskRegistrationCodeInit(data) {
  return request({
    url: '/company/companyDiskRegistrationCode/init',
    method: 'post',
    data,
  })
}

export function getResetPwdSmsCode(data){
  return request({
      url: `/company/companyUser/getResetPwdSmsCode`,
      method: 'get',
      params: {phone :data},
  })
}

export function resetPwdByUser(data){
  return request({
      url: `/company/companyUser/resetPwdByUser`,
      method: 'put',
      data
  })
}


