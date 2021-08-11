import request from '@/utils/request'

//获取客户类别列表
export  function  getCustomerManagementCategory()  {
    return  request({
        url:   '/customer/customerManagementCategory/selectCategoryList',
        method:   'get',
        //    params: data,
        headers: {
            showLoading: true
        }
    })
}
//获取客户类别列表
export  function  getCustomerManagementCategoryAll()  {
    return  request({
        url:   '/customer/customerManagementCategory/selectCategoryAll',
        method:   'get',
        //    params: data,
        headers: {
            showLoading: true
        }
    })
}

//根据条件查询客户列表信息
export function getCustomerList(data) {
    return request({
        url: '/customer/customerManagement/getCustomerListByWhere',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}

//新增用户类别
export function addCustomerCategory(data) {
    return request({
        url: '/customer/customerManagementCategory/addCategory',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}

//修改用户类别
export function editCustomerCategory(data) {
    return request({
        url: '/customer/customerManagementCategory/updateCategory',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}

//删除用户类别
export  function  deleteCustomerCategory(data)  {
    return  request({
        url:   '/customer/customerManagementCategory/delCategory' + '/' + data,
        method:   'get',
        headers: {
            showLoading: true
        }
    })
}

//新增客户
export function addCustomer(data) {
    return request({
        url: '/customer/customerManagement/addCustomer',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}

//修改客户
export function updateCustomer(data) {
    return request({
        url: '/customer/customerManagement/updateCustomer',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}

//删除用户
export  function  deleteCustomer(data)  {
    return  request({
        url:   'customer/customerManagement/delCustomer',
        method:   'post',
        data,
        headers: {
            showLoading: true
        }
    })
}

//抬头信息查询客户
export  function  serchCustomer(data)  {
    return  request({
        url:   `/customer/customerManagement/autoSelectCustomerList?companyId=${data.companyId}&customerName=${data.customerName}`,
        method:   'post',
        data,
        headers: {
            showLoading: true
        }
    })
}

//下载模板
export function customerTemplate(data) {
    return request({
        url: '/customer/customerManagement/exportTemplate',
        method: 'post',
        params: data,
        responseType: 'blob',
        headers: {
            showLoading: true
        }
    })
}