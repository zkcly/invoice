import request from '@/utils/request'

//根据msgId查询核心通信回调缓存

// export  function  getRedisList(data)  {
//     return  request({
//         url:   `/server/redis/getRedisList?keys=${data}`,
//         method:   'get',
//         //  params: data,
//         headers: {
//             showLoading: true
//         }
//     })
// }

export  function  getRedisList(data)  {
    return  request({
        url:   '/server/redis/getRedisList',
        method:   'post',
        data,
        headers: {
             showLoading:false
        }
    })

}

export  function  getRedisList2(data)  {
  return  request({
      url:   '/server/redis/getRedisList',
      method:   'post',
      data,
      headers: {
           showLoading:false
      }
  })

}

//根据msgId查询核心通信回调缓存
export  function  getRedis(data)  {
    return  request({
        url:   '/server/redis/getRedis',
        method:   'get',
        params:  data,
        headers: {
            showLoading: false
        }
    })
}
//根据msgId查询核心通信回调缓存
export  function  getRedisY(data)  {
    return  request({
        url:   '/server/redis/getRedis',
        method:   'get',
        params:  data,
        headers: {
            showLoading: true
        }
    })
}


//查询发票库存列表
export  function  getInvoiceInventoryList(data)  {
    return  request({
        url:   '/server/invoiceInventory/list',
        method:   'get',
        params:  data,
        headers: {
            showLoading: false
        }
    })
}