import Vue from 'vue'
import { MessageBox } from 'element-ui';
//成功弹窗-不传内容
const alertSuccess = () => {
        MessageBox.confirm('提交成功', '', {
            showCancelButton: false,
            showClose: false,
            type: "success",
            customClass: 'globalAlertSuccess',
            center: true
        }).then(() => {}).catch(() => {});
    }
    //失败弹窗-不传内容
const alertError = () => {
    MessageBox.confirm('提交失败', '', {
        showCancelButton: false,
        showClose: false,
        type: "warning",
        customClass: 'globalAlertSuccess',
        center: true
    }).then(() => {}).catch(() => {});
}

//成功弹窗-传内容
const alertSuccessContent = (params) => {
    MessageBox.confirm(params, '', {
        showCancelButton: false,
        type: 'success'
    }).then(() => {}).catch(() => {});
}

const closeContent = (() => {
    MessageBox.close();
})



export default function(Vue) {
    //添加全局API
    Vue.prototype.$globals = {
        alertSuccess,
        alertError,
        alertSuccessContent,
        closeContent,

    }
}
