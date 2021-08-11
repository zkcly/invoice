module.exports = {

  title: '电专工厂',

  /**
   * @description oss地址下载个前缀，https://dzgc-files.oss-cn-hangzhou.aliyuncs.com/ +后端接口返回的url
   */
  ossURL:'https://dzgc-files.oss-cn-hangzhou.aliyuncs.com/',


  /**
   * @type {boolean} true | false
   * @description Whether fix the header 固定头部
   */
  fixedHeader: false,
  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认30天
   */
  tokenCookieExpires: 30,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认30天s
   */
  passCookieExpires: 30,
  /**
   * @description 是否只保持一个子菜单的展开
   */
  uniqueOpened: true,
  /**
   * @description token key
   */
  TokenKey: 'Company-Authorization',
  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 120000,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,
  clientCode:'dzgc',//客户端编码
}
