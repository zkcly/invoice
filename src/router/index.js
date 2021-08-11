import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/resetPassword',
        component: () =>
            import ('@/views/resetPassword/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        meta: {
            title: '首页',
            icon: 'dashboard'
        },
        children: [{
                path: 'dashboard',
                name: 'dashboard',
                component: () =>
                    import ('@/views/dashboard/index'),
                meta: {
                    title: '首页',
                    icon: ''
                }
            },
            {
                path: 'reviewInvoicing',
                name: 'reviewInvoicing',
                component: () =>
                    import ('@/views/home/ReviewInvoicing'),
                meta: {
                    title: '审核开票',
                    icon: ''
                }
            },
            {
                path: 'lightningInvoicing',
                component: () =>
                    import ('@/views/home/LightningInvoicing.vue'),
                name: 'LightningInvoicing',
                meta: { title: '闪电开票', icon: '' }
            },
            {
                path: 'scanInvoicing',
                component: () =>
                    import ('@/views/home/ScanInvoicing.vue'),
                name: 'ScanInvoicing',
                meta: { title: '扫码开票', icon: '' }
            },
            {
                path: 'historyInvoicing',
                component: () =>
                    import ('@/views/home/ScanInvoicing/historyInvoicing.vue'),
                name: 'historyInvoicing',
                // meta: { title: '', icon: '' }
            },
            {
                path: 'setInvoicing',
                component: () =>
                    import ('@/views/home/ScanInvoicing/setInvoicing.vue'),
                name: 'setInvoicing',
                // meta: { title: '', icon: '' }
            },
            {
                path: 'batchInvoicing',
                name: 'batchInvoicing',
                component: () =>
                    import ('@/views/home/BatchInvoicing.vue'),
                meta: {
                    title: '批量开票',
                    icon: ''
                }
            },
            {
                path: 'inventoryInvoicing',
                name: 'inventoryInvoicing',
                component: () =>
                    import ('@/views/home/InventoryInvoicing.vue'),
                meta: {
                    title: '清单开票',
                    icon: ''
                }
            },
            {
                path: '/inventoryInvoicing/templateSetting',
                name: 'templateSetting',
                component: () =>
                    import ('@/views/home/TemplateSetting.vue')
            },
            {
                path: 'blacklistIndex',
                name: 'blacklistIndex',
                component: () =>
                    import ('@/views/blacklist/blacklistIndex'),
                meta: {
                    title: '黑名单',
                    icon: ''
                }
            },
            {
                path: 'print',
                name: 'Print',
                component: () =>
                    import ('@/views/home/print'),
                meta: {
                    title: '打印',
                    icon: ''
                }
            },
        ]
    },

    {
        path: '/management',
        component: Layout,
        redirect: '/management/index',
        meta: {
            title: '销项管理',
            icon: 'el-icon-s-help'
        },
        children: [{
                path: 'index',
                name: 'managementIndex',
                component: () =>
                    import ('@/views/management/index.vue'),
                meta: {
                    title: '首页',
                    icon: ''
                }
            },
            {
                path: 'invoicingManagement',
                name: 'invoicingManagement',
                meta: {
                    title: '开票管理',
                    icon: ''
                },
                component: () =>
                    import ('@/components/nested.vue'),
                children: [{
                        path: 'awaitList',
                        name: 'awaitList',
                        component: () =>
                            import ('@/views/management/AwaitList.vue'),
                        meta: {
                            title: '待开列表',
                            icon: ''
                        },
                    },
                    {
                        path: 'redLetters',
                        component: () =>
                            import ('@/views/management/RedLetterList.vue'),
                        name: 'redLetters',
                        meta: {
                            title: '红字信息表'
                        }
                    },
                    {
                        path: 'redApply',
                        component: () =>
                            import ('@/views/management/RedApply.vue'),
                        name: 'redApply',
                        meta: {
                            title: '红字信息表-申请'
                        }
                    },
                    {
                        path: 'redSaleApply',
                        component: () =>
                            import ('@/views/management/RedSaleApply.vue'),
                        name: 'redSaleApply',
                        meta: {
                            title: '红字信息表-销售方申请'
                        }
                    },
                    {
                        path: 'emptyInvalid',
                        component: () =>
                            import ('@/views/management/EmptyInvalid.vue'),
                        name: 'emptyInvalid',
                        meta: {
                            title: '空白作废'
                        }
                    },
                    {
                        path: 'invoiceStock',
                        component: () =>
                            import ('@/views/management/InvoiceStock.vue'),
                        name: 'invoiceStock',
                        meta: {
                            title: '发票库存'
                        }
                    },
                    {
                        path: 'applyDistribution',
                        component: () =>
                            import ('@/views/management/ApplyDistribution.vue'),
                        name: 'applyDistribution',
                        meta: {
                            title: '申领分发'
                        },
                    },
                    {
                        path: 'invoiceApply',
                        component: () =>
                            import ('@/views/management/InvoiceApply.vue'),
                        name: 'invoiceApply',
                        meta: {
                            title: '发票申领'
                        },
                    },
                    {
                        path: 'recipientSetting',
                        component: () =>
                            import ('@/views/management/RecipientSetting.vue'),
                        name: 'recipientSetting',
                        meta: {
                            title: '收件人设置'
                        },
                    },
                    // {
                    //   path: 'goodsManagement',
                    //   component: () =>
                    //     import('@/views/management/goodsManagement/GoodstManagement.vue'),
                    //   name: 'goodsManagement',
                    //   meta: {
                    //     title: '商品管理'
                    //   },
                    // },
                    {
                        path: 'goodsManagement',
                        component: () =>
                            import ('@/views/management/goodsManagement/GoodstManagement.vue'),
                        name: 'goodsManagement',
                        meta: {
                            title: '商品管理'
                        },
                    },
                    {
                        path: 'taxEncode',
                        component: () =>
                            import ('@/views/management/goodsManagement/TaxEncode.vue'),
                        name: 'taxEncode',
                        meta: {
                            title: '税收编码'
                        },
                    },
                    {
                        path: 'clientManagement',
                        component: () =>
                            import ('@/views/management/clientManagement/ClientManagement.vue'),
                        name: 'clientManagement',
                        meta: {
                            title: '客户管理'
                        },
                    },
                    {
                        path: 'smsrechargeList',
                        component: () =>
                            import ('@/views/management/smsrecharge/smsrechargeList.vue'),
                        name: 'smsrechargeList',
                        meta: {
                            title: '短信充值'
                        },
                    },
                ]
            },
            {
                path: 'summaryManagement',
                name: 'summaryManagement',
                meta: {
                    title: '汇总处理',
                    icon: ''
                },
                component: () =>
                    import ('@/components/nested.vue'),
                children: [{
                        path: 'uploadList',
                        name: 'uploadList',
                        component: () =>
                            import ('@/views/summary/uploadList.vue'),
                        meta: {
                            title: '汇总上传',
                            icon: ''
                        },
                    },
                    {
                        path: 'monitoringInformationList',
                        component: () =>
                            import ('@/views/summary/monitoringInformationList.vue'),
                        name: 'monitoringInformationList',
                        meta: {
                            title: '监控信息'
                        },
                    },
                    {
                        path: 'InvoiceInquiry',
                        name: 'InvoiceInquiry',
                        component: () =>
                            import ('@/views/summary/InvoiceInquiry.vue'),
                        meta: {
                            title: '发票查询'
                        },
                    },
                    {
                        path: 'invoiceTotal',
                        name: 'invoiceTotal',
                        component: () =>
                            import ('@/views/summary/invoiceTotal.vue'),
                        meta: {
                            title: '开票统计'
                        },
                    },
                ]
            },

        ]
    },

    {
        path: '/settings',
        component: Layout,
        meta: {
            title: '系统设置',
            icon: 'el-icon-setting'
        },
        redirect: '/settings/index',
        children: [{
                path: 'index',
                name: 'settingIndex',
                component: () =>
                    import ('@/views/settings/index'),
                meta: {
                    title: '首页',
                    icon: ''
                }
            },
            {
                path: 'initial',
                name: 'initial',
                component: () =>
                    import ('@/views/form/index'),
                meta: {
                    title: '初始设置',
                    icon: ''
                }
            },
            {
                path: 'userList',
                name: 'userList',
                component: () =>
                    import ('@/views/settings/user/userList.vue'),
                meta: {
                    title: '用户管理',
                    icon: ''
                }
            },
            {
                path: 'role',
                name: 'role',
                component: () =>
                    import ('@/views/settings/role/role'),
                meta: {
                    title: '角色管理',
                    icon: ''
                }
            },
            {
                path: 'rule',
                name: 'rule',
                component: () =>
                    import ('@/views/settings/rule/rule'),
                meta: {
                    title: '规则管理',
                    icon: ''
                }
            },
            {
                path: 'updateLog',
                name: 'updateLog',
                component: () =>
                    import ('@/views/updateLog/index.vue'),
                meta: {
                    title: '更新日志',
                    icon: ''
                }
            },
        ]
    },

    {
        path: '/smartreimbur/open',
        component: Layout,
        meta: {
            title: '智能财税',
            icon: 'el-icon-magic-stick'
        },
        children: [{
                path: 'smartreimburIndex',
                name: 'SmartreimburIndex',
                component: () =>
                    import ('@/views/smartreimbur/SmartreimburIndex.vue'),
                meta: {
                    title: '智能财税',
                    icon: ''
                }
            },

            {

                path: 'sement',
                name: 'Sement',
                component: () =>
                    import ('@/views/smartreimbur/Sement.vue'),
                meta: { title: '智能报销', icon: '' }
            }

        ]
    },

    {
      path: 'incomeModule',
      component: Layout,
      meta: {
          title: '进项管理',
          icon: 'el-icon-magic-stick'
      },
      children: [{
              path: 'incomeModule',
              name: 'incomeModule',
              component: () =>
                  import ('@/views/incomeModule/index.vue'),
              meta: {
                  title: '进项管理',
                  icon: ''
              }
          },
      ]
  },

    {
        path: '/renew/open',
        component: Layout,
        meta: {
            title: '版本更新',
            icon: 'el-icon-magic-stick'
        },
        children: [{
            path: 'renew',
            name: 'renew',
            component: () =>
                import ('@/views/renew/renew.vue'),
            meta: {
                title: '版本更新',
                icon: ''
            }
        }, ]
    },
    // 404 page must be placed at the end !!!
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

// router.onError((error) => {
//     const pattern = /Loading chunk (\d)+ failed/g;
//     const isChunkLoadFailed = error.message.match(pattern);
//     const targetPath = router.history.pending.fullPath;
//     if (isChunkLoadFailed) {
//      router.replace(targetPath);
//     }
//    });
// router.onError((error) => {
//   console.error(error)
//   const pattern = /Loading chunk/g
//   // const pattern = /Loading chunk (\d)+ failed/g
//   const isChunkLoadFailed = error.message.match(pattern)
//   const targetPath = router.history.pending.fullPath
//   if (isChunkLoadFailed && error.type === 'missing') {
//     // const targetPath = router.history.pending.fullPath
//     router.push(targetPath)
//   }
// })


export default router