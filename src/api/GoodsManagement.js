import request from '@/utils/request'
// 分页查询
export  function  getGoodslistPage(data)  {
    return  request({
        url: 'company/companyGoods/listPage',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}
// 根据税盘信息获取票种类型
export function getDiskTicketTypeApi(data) {
    return request({
        url: 'company/companyDiskTicketType/getDiskTicketType',
        method: 'get',
        params: data,
    })
}
//模糊查询
export  function  KeywordSearch(data)  {
    return  request({
        url:   `/company/companyGoods/listPage`,
        method:   'post',
        data,
        headers: {
            showLoading: true
        }
    })
}


// 新增商品信息
export function addListApi(data) {
    return request({
        url: '/company/companyGoods',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}


// 修改商品信息
export function updateListApi(data) {
    return request({
        url: '/company/companyGoods',
        method: 'put',
        data,
        headers: {
            showLoading: true
        }
    })
}


//批量删除
export function delGoodsApi(data) {
    return request({
        url: `/company/companyGoods/${data}`,
        method: 'delete',
        data,
        headers: {
            showLoading: true
        }
    })
}

// 商品类型信息查询
export  function  getTreelistAllApi(data)  {
    return  request({
        url: '/company/goodsType/listAll',
        method: 'get',
        params: data,
        headers: {
            showLoading: true
        }
    })
}

// 商品类型信息查询
export  function  getTreelistApi(data)  {
    return  request({
        url: '/company/goodsType/list',
        method: 'get',
        params: data,
        headers: {
            showLoading: true
        }
    })
}
// 新增商品信息类型
export function addTreeListApi(data) {
    return request({
        url: '/company/goodsType',
        method: 'post',
        data,
        headers: {
            showLoading: true
        }
    })
}

//修改商品信息类型
export function updateTreeListApi(data) {
    return request({
        url: '/company/goodsType',
        method: 'put',
        data,
        headers: {
            showLoading: true
        }
    })
}

//删除商品信息类型
export function delTreeListApi(id) {
    return request({
        url: '/company/goodsType/' + id,
        method: 'delete',
    })
}

//导出下载
export function exportGoods(data) {

    return request({
        url: '/company/companyGoods/exportTemplate',
        method: 'post',
        params: data,
        responseType: 'blob',
        headers: {
            showLoading: true
        }
    })
}

//智能赋码
export function SmartCode(data) {
    return request({
        url: 'company/companyGoods/autoCode',
        method: 'post',
        params: data,
        headers: {
            showLoading: true
        }
    })
}