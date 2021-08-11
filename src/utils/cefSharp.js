
let initedCefWindow = false;
export async function cefSharpinit(fn,flag){
  try{
    if(window.CefSharp && window.CefSharp.BindObjectAsync){
      if(initedCefWindow === false){
       await window.CefSharp.BindObjectAsync('cefWindow');//绑定对象并等待异步完成
      };
        initedCefWindow = true;
      }
      //window.cefWindow.init(() => {
      //  window.cefWindow.normal();
      //  //此处点击后端后右键退出执行
      //})
      if(fn=='setAutoRun'){
        window.cefWindow[fn](flag);
      }else{
        window.cefWindow[fn]();//调用C#方法
      }
  }catch(err){
    // console.log('异常')
  }
}
//窗口放大 窗口将最大化
export function cefSharpMaximize(){
  cefSharpinit('maximize')
}

//恢复窗口
export function cefSharpNormal(){
  cefSharpinit('normal')
}


//最小化 调用此方法后，窗口将最小化到任务栏
export function cefSharpMinimize(){

  cefSharpinit('minimize')
}

//关闭窗口(程序将退出)
export function cefSharpclose(){
  cefSharpinit('close')
}

//窗口将最小化到托盘
export function cefSharpMinimizeToNotifyIcon(){
  cefSharpinit('minimizeToNotifyIcon')
}


//移动窗口  调用此方法后，窗口将随鼠标移动(若窗口此时为最大化，会自动恢复到普通状态)，直到鼠标左边up
export function cefSharpStartMove(){
  cefSharpinit('startMove')
}
//客户端测试显示开发工具
export function cefSharpShowDevTool(){
  cefSharpinit('showDevTool')
}


//客户端当前开机自启动状态 true 开机自启动 false关闭开机自启动
export function setAutoRun(flag){
  cefSharpinit('setAutoRun',flag)
}




