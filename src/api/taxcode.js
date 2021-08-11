import request from '@/utils/request'

export  function  getTaxListInfo(data)  {
    return  request({
        url:   '/company/goodsCode/listByCondition',
        method:   'post',
        data,
        headers: {
            showLoading: true
        }
    })

}
//获取左侧树结构

export  function  getTreelistInfo(data)  {
    return  request({
        url:   '/company/goodsCode/treeList',
        method:   'get',
        data,
        headers: {
            showLoading: true
        }
    })

}