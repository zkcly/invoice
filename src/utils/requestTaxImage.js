import axios from 'axios'
import { MessageBox, Message,Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Config from '@/settings'
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/loadingX'
axios.defaults.withCredentials=false

const tokey=Config.TokenKey

// let loading;
// //当前正在请求的数量
// let needLoadingRequestCount = 0;

// //显示loading
// function showLoading(target) {
//   if (needLoadingRequestCount === 0 && !loading) {
//     loading = Loading.service({
//       lock: true,
//       text: "Loading...",
//       background: 'rgba(255, 255, 255, 0.7)',
//       // spinner: 'el-icon-loading',
//       // background: 'rgba(0, 0, 0, 0.7)',
//       target: target || "body"
//     });
//   }
//   needLoadingRequestCount++;
// }
// //隐藏loading
// function hideLoading() {
//   needLoadingRequestCount--;
//   needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); //做个保护
//   if (needLoadingRequestCount === 0) {
//     //关闭loading
//     loading.close()
//   }
// }


// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: Config.timeout // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (config.headers.showLoading) {
    //   showLoading();
    // }
    if (config.headers.showLoading !== false) {
      // 如果配置了isLoading: false，则不显示loading
      showFullScreenLoading("加载中")
    }
    if ( getToken()) {
      // let each request carry token
      // ['Company_Authorization'] is a custom headers key
      // please modify it according to the actual situation
      config.headers[tokey] = getToken()
    }
    //config.headers['Company_Authorization']='Bearer outer-rest-test-token'
    return config
  },
  error => {
    tryHideFullScreenLoading()
    Promise.reject(error)
    //   Message.error({
    //   message: '加载超时'
    //  })
    // do something with request error
    // console.log(error) // for debug
    // return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // if (response.config.headers.showLoading) {
    //   hideLoading();
    // }
    tryHideFullScreenLoading()

    if(response.headers['content-disposition']){
     //下载文件流 excel
      return response
    }else{
      //const res = response.data
      //return res;
      
        const res = response.data
        return res;
      
    }

    //if(res.code !== 200){
    //  //Message({
    //  //      message: res.msg || 'Error',
    //  //      type: 'error',
    //  //      duration: 5 * 1000
    //  //    })
    //}else{
    //  return res;
    //}



    // if the custom code is not 20000, it is judged as an error.
    //if (res.code !== 20000) {
    //  Message({
    //    message: res.message || 'Error',
    //    type: 'error',
    //    duration: 5 * 1000
    //  })
    //
    //  // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //  if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //    // to re-login
    //    MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //      confirmButtonText: 'Re-Login',
    //      cancelButtonText: 'Cancel',
    //      type: 'warning'
    //    }).then(() => {
    //      store.dispatch('user/resetToken').then(() => {
    //        location.reload()
    //      })
    //    })
    //  }
    //  return Promise.reject(new Error(res.message || 'Error'))
    //} else {
    //  return res
    //}
  },
  error => {
    // if (error.config.headers.showLoading) {
    //   tryHideFullScreenLoading()
    // }
    tryHideFullScreenLoading()
    if (error.toString().indexOf('Error: timeout') !== -1) {
      Message({
        message: '税局服务不稳定，请稍后再试',
        type: 'error',
        duration: 5 * 1000
      })
    }else{
      console.log('接口',error.config.headers)
      //Message({
      //  message: error.config.headers,
      //  type: 'error',
      //  duration: 5 * 1000
      //})
    }

    return Promise.resolve(error)
  }
)

export default service
