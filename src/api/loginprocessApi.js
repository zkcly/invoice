import request from "@/utils/request";
import {simpleRequest} from "@/utils/requestClient";

export function invoiceInquiryInit(params){
    return request({
        url: `/server/invoiceInquiry/init`,
        method: 'get',
        params,
        headers: {
            showLoading: false
          }
    })
  }


  export function checkTaxDiskIsOnline(data){
    return request({
        url: `/company/taxDisk/checkTaxDiskIsOnline/${data}`,
        method: 'get',
        headers: {
            showLoading: false,
          }
    })
  }

  export function companyDiskRegistrationCodeInit(data) {
    return request({
      url: '/company/companyDiskRegistrationCode/init',
      method: 'post',
      data,
      headers: {
        showLoading: false,
      }
    })
  }

  export function getLoginInfo() {
    return request({
      url: '/company/companyUser/getLoginInfo',
      method: 'get',
      headers: {
        isloginApi:true
      }
    })
  }
  export function listXiaoApi(data) {
    return request({
      url: '/company/sellerInfo/list/' + data,
      method: 'get',
      headers: {
        showLoading: false
      }
    })
  }


  export function listByTokenApi(data) {
    return request({
      url: '/company/taxDisk/listByToken',
      method: 'get',
      params: data,
      headers: {
        showLoading: true,
        isloginApi:true
      }
    })
  }