import axios from 'axios'
import { MessageBox, Message,Loading } from 'element-ui'
import store from '../store/index'
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/loadingX'
import Config from '@/settings'
axios.defaults.withCredentials=false

const tokey=Config.TokenKey

// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  headers: {'Cache-Control': 'no-cache'},
  timeout: 60000 // request timeout
})

// request interceptor
request.interceptors.request.use(
  config => {
    // if ( getToken()) {
    
    //   config.headers[tokey] = getToken()
    // }
    if (config.showLoading !== false) {
      // 如果配置了isLoading: false，则不显示loading
      showFullScreenLoading("加载中")
    }
    return config
  },
  error => {
    tryHideFullScreenLoading()
    Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
 
  response => {
       tryHideFullScreenLoading()
        const res = response.data
        return res;
  },
  error => {
    tryHideFullScreenLoading()
    if (error.toString().indexOf('Error: timeout') !== -1) {
      // Message({
      //   message: '税局服务不稳定，请稍后再试',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      MessageBox({
        confirmButtonText: "知道了",
        title: "提示：",
        message:'税局服务不稳定，请稍后再试',
        type: "warning",
        showClose:false,
        callback:()=>{
           store.commit("user/showLoginWin", false);
        }
      });
    }
    return Promise.resolve(error)
  }
)

const simpleRequest = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 120000
})

simpleRequest.interceptors.response.use(
  response => {
        const res = response.data
        return res;
  },
  error => {
    return Promise.resolve(error)
  }
)

export  {request,simpleRequest}
