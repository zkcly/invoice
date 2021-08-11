import { Loading } from 'element-ui'

let loading
function startLoading (message) {
  loading = Loading.service({
    // lock: true,
    // fullscreen:false,
    text: message,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass:'loading-fullen'
  })
  // console.log("456456465")
}

function endLoading () {
  loading.close()
}

//那么 showFullScreenLoading() tryHideFullScreenLoading() 就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
const showFullScreenLoading = function(message) {
  if (needLoadingRequestCount === 0) {
    startLoading(message)
  }
  needLoadingRequestCount++
}

const tryHideFullScreenLoading = function() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

export {
  startLoading,
  endLoading,
  showFullScreenLoading,
  tryHideFullScreenLoading
}