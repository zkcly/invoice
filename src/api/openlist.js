import request from '@/utils/request'
//待开列表
export function OpenList(data) {
    return request({
        url: '/server/todo/delete',
        method: 'delete',
        data,
        headers: {
            showLoading: true
        }
    })
}