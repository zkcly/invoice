import request from '@/utils/request'

export function download() {
    return request({
        url: '/server/todo/batch/downloadTemplate',
        method: 'get',
        responseType: 'blob',
        headers: {
            showLoading: true
        }
    })
}