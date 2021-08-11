var resultList=[
  //首页
  {
    id:'01',
    path: "dashboard",
    name: "Dashboard",
    label: "首页",
    children: [
      {
        id:'1',
        path: "reviewInvoicing",
        name: "ReviewInvoicing",
        label: "审核开票",
        icon: "",
        parentid:'01'
      },
      {
        id:2,
        path: "lightningInvoicing",
        name: "LightningInvoicing",
        label: "闪电开票",
        icon: "",
        parentid:'01'
      },
      {
        id:3,
        path: "scanInvoicing",
        name: "ScanInvoicing",
        label: "扫码开票",
        icon: "",
        parentid:'01'
      },
      {
        id:4,
        path: "batchInvoicing",
        name: "batchInvoicing",
        label: "批量开票",
        icon: "",
        parentid:'01'
      },
      {
        id:5,
        path: "inventoryInvoicing",
        name: "inventoryInvoicing",
        label: "清单开票",
        icon: "",
        parentid:'01'
      }
    ],
  },
  //销项管理
  {
    id:'02',
    path: "/management",
    name: "managementIndex",
    label: "销项管理",
    icon: "",
    children: [
      {
        id:6,
        path: "invoicingManagement",
        name: "invoicingManagement",
        label: "开票管理",
        icon: "",
        parentid:'02',
        children: [
          {
            id:7,
            path: "awaitList",
            name: "AwaitList",
            label: "待开列表",
            icon: "",
            parentid:'6',
          },
          {
            id:8,
            path: "redLetters",
            name: "ReadLetters",
            label: "红字信息表",
            icon: "",
            parentid:'6',
          },
          {
            id:9,
            path: "emptyInvalid",
            name: "EmptyInvalid",
            label: "空白作废",
            icon: "",
            parentid:'6',
          },
          {
            id:10,
            path: "invoiceStock",
            name: "InvoiceStock",
            label: "发票库存",
            icon: "",
            parentid:'6',
          },
          {
            id:11,
            path: "applyDistribution",
            name: "ApplyDistribution",
            label: "申领分发",
            icon: "",
            parentid:'6',
          },
          {
            id:12,
            path: "recipientSetting",
            name: "RecipientSetting",
            label: "收件人设置",
            icon: "",
            parentid:'6',
          },
          {
            id:13,
            path: "goodsManagement2",
            name: "ProductManagement2",
            label: "商品管理",
            icon: "",
            parentid:'6',
          },
          {
            id:14,
            path: "clientManagement",
            name: "ClientManagement",
            label: "客户管理",
            icon: "",
            parentid:'6',
          },
          {
            id:15,
            path: "smsrechargeList",
            name: "smsrechargeList",
            label: "短信充值",
            icon: "",
            parentid:'6',
          },
        ],
      },
      {
        id:16,
        path: "summaryManagement",
        name: "summaryManagement",
        label: "汇总处理",
        icon: "",
        parentid:'02',
        children: [
          {
            id:17,
            path: "uploadList",
            name: "uploadList",
            label: "汇总上传",
            icon: "",
            parentid:'16',
          },
          {
            id:18,
            path: "monitoringInformationList",
            name: "monitoringInformationList",
            label: "监控信息",
            icon: "",
            parentid:'16',
          },
          {
            id:19,
            path: "InvoiceInquiry",
            name: "InvoiceInquiry",
            label: "发票查询",
            icon: "",
            parentid:'16',
          },
          {
            id:20,
            path: "invoiceTotal",
            name: "invoiceTotal",
            label: "开票统计",
            icon: "",
            parentid:'16',
          },
        ],
      },
    ],
  },
  //系统设置
  {
    id:'03',
    path: "/settings",
    name: "settingIndex",
    label: "系统设置",
    icon: "",
    children: [
      {
        id:28,
        path: "initial",
        name: "initialSettings",
        label: "初始设置",
        icon: "",
        parentid:'03',
      },
      {
        id:29,
        path: "userList",
        name: "userList",
        label: "用户管理",
        icon: "",
        parentid:'03',
      },
      {
        id:30,
        path: "role",
        name: "roleSettings",
        label: "角色管理",
        icon: "",
        parentid:'03',
      },
      {
        id:31,
        path: "rule",
        name: "ruleSettings",
        label: "规则管理",
        icon: "",
        parentid:'03',
      }
    ],
  },
  //智能财税
  {
    id:33,
    path: "/smartreimbur/open",
    name: "SmartreimburIndex",
    label: "智能财税",
    icon: "el-icon-magic-stick",
    children: [

      {
        id:35,
        path: "sement",
        name: "Sement",
        label: "智能报销",
        icon: "" ,
      },
      {
        id:34,
        path: "smartreimburIndex",
        name: "SmartreimburIndex",
        label: "智能财税",
        icon: "",
      },
    ],
  },
];
