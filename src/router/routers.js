import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */
export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/hxx-store/login.vue')
  },
  {
    path: '/fox',
    name: 'fox',
    meta: {
      title: '火狐打印控件例外',
      hideInMenu: true
    },
    component: () => import('@/hxx-store/fox.vue')
  },
  {
    path: '/protocol',
    name: 'protocol',
    meta: {
      title: '用户协议',
      hideInMenu: true,
      noLogin: true
    },
    component: () => import('@/hxx-store/protocol.vue')
  },
  {
    path: '/admin-login',
    name: 'admin-login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true,
    },
    component: () => import('@/hxx-admin/login.vue')
  },
  {
    path: '/storeRegister',
    name: 'storeRegister',
    meta: {
      hideInMenu: true,
      title: '门店注册',
      lgType: "1002",
      notCache: true
    },
    component: () => import('@/hxx-store/storeRegister')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      // {
      //   path: '/home',
      //   name: 'home',
      //   meta: {
      //     hideInMenu: true,
      //     title: '首页',
      //     notCache: true
      //   },
      //   component: () => import('@/view/single-page/home')
      // }storeRegister
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          lgType: "1002",
          notCache: true
        },
        component: () => import('@/hxx-store/home')
      },
      {
        path: '/admin-home',
        name: 'admin-home',
        meta: {
          hideInMenu: true,
          title: '首页',
          lgType: "1001",
          notCache: true
        },
        component: () => import('@/hxx-admin/home')
      }
    ]
  },
  // {
  //   path: '',
  //   name: 'doc',
  //   meta: {
  //     title: '文档',
  //     href: 'https://lison16.github.io/iview-admin-doc/#/',
  //     icon: 'ios-book'
  //   }
  // },
  // {
  //   path: '/join',
  //   name: 'join',
  //   component: Main,
  //   children: [
  //     {
  //       path: 'join_page',
  //       name: 'join_page',
  //       meta: {
  //         icon: '_qq',
  //         title: 'QQ群'
  //       },
  //       component: () => import('@/view/join-page.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/components',
  //   name: 'components',
  //   meta: {
  //     icon: 'logo-buffer',
  //     title: '测试'
  //   },
  //   component: Main,
  //   children: [
  // //     {
  // //       path: 'count_to_page',
  // //       name: 'count_to_page',
  // //       meta: {
  // //         icon: 'md-trending-up',
  // //         title: '数字渐变'
  // //       },
  // //       component: () => import('@/view/components/count-to/count-to.vue')
  // //     },
  //     {
  //       path: 'tables_page',
  //       name: 'tables_page',
  //       meta: {
  //         icon: 'md-grid',
  //         title: '多功能表格'
  //       },
  //       component: () => import('@/view/components/tables/tables.vue')
  //     },
  //     {
  //       path: 'test',
  //       name: 'test',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '测试',
  //       },
  //       component: () => import('@/hxx-store/test.vue')
  //     },
  //
  //   ]
  // },
  // {
  //   path: '/update',
  //   name: 'update',
  //   meta: {
  //     icon: 'md-cloud-upload',
  //     title: '数据上传'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'update_table_page',
  //       name: 'update_table_page',
  //       meta: {
  //         icon: 'ios-document',
  //         title: '上传Csv'
  //       },
  //       component: () => import('@/view/update/update-table.vue')
  //     },
  //     {
  //       path: 'update_paste_page',
  //       name: 'update_paste_page',
  //       meta: {
  //         icon: 'md-clipboard',
  //         title: '粘贴表格数据'
  //       },
  //       component: () => import('@/view/update/update-paste.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/excel',
  //   name: 'excel',
  //   meta: {
  //     icon: 'ios-stats',
  //     title: 'EXCEL导入导出'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'upload-excel',
  //       name: 'upload-excel',
  //       meta: {
  //         icon: 'md-add',
  //         title: '导入EXCEL'
  //       },
  //       component: () => import('@/view/excel/upload-excel.vue')
  //     },
  //     {
  //       path: 'export-excel',
  //       name: 'export-excel',
  //       meta: {
  //         icon: 'md-download',
  //         title: '导出EXCEL'
  //       },
  //       component: () => import('@/view/excel/export-excel.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/directive',
  //   name: 'directive',
  //   meta: {
  //     hide: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'directive_page',
  //       name: 'directive_page',
  //       meta: {
  //         icon: 'ios-navigate',
  //         title: '指令'
  //       },
  //       component: () => import('@/view/directive/directive.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/multilevel',
  //   name: 'multilevel',
  //   meta: {
  //     icon: 'md-menu',
  //     title: '多级菜单'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'level_2_1',
  //       name: 'level_2_1',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '二级-1'
  //       },
  //       component: () => import('@/view/multilevel/level-2-1.vue')
  //     },
  //     {
  //       path: 'level_2_2',
  //       name: 'level_2_2',
  //       meta: {
  //         access: ['super_admin'],
  //         icon: 'md-funnel',
  //         showAlways: true,
  //         title: '二级-2'
  //       },
  //       component: parentView,
  //       children: [
  //         {
  //           path: 'level_2_2_1',
  //           name: 'level_2_2_1',
  //           meta: {
  //             icon: 'md-funnel',
  //             title: '三级'
  //           },
  //           component: () => import('@/view/multilevel/level-2-2/level-3-1.vue')
  //         }
  //       ]
  //     },
  //     {
  //       path: 'level_2_3',
  //       name: 'level_2_3',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '二级-3'
  //       },
  //       component: () => import('@/view/multilevel/level-2-3.vue')
  //     },
  //   ]
  // },
  {
    path: '/car-inspection1',
    name: 'car-inspection1',
    meta: {
      icon: 'logo-buffer',
      title: '车辆检查',
      lgType: "1002",
      access: '1011',
    },
    component: Main,
    children:[
      {
        path: '/car-inspection-list',
        name: 'car-inspection-list',
        meta: {
          icon: 'md-funnel',
          title: '车辆检查',
          lgType: "1002",
          access: '101101',
        },
        component: () => import('@/hxx-store/car-inspection/car-inspection-list.vue')
      }
    ]
  },
  {
    path: '/car-inspection2',
    name: 'car-inspection2',
    meta: {
      icon: 'logo-buffer',
      title: '车辆检查',
      lgType: "1001",
      access: '1012',
    },
    component: Main,
    children:[
      {
        path: '/inspection-report-head',
        name: 'inspection-report-head',
        meta: {
          icon: 'md-funnel',
          title: '报告统计（总店）',
          lgType: "1001",
          access: '101201',
        },
        component: () => import('@/hxx-store/car-inspection/inspection-report-head.vue')
      },
      {
        path: '/inspection-report-statistics',
        name: 'inspection-report-statistics',
        meta: {
          icon: 'md-funnel',
          title: '报告统计（保险公司）',
          lgType: "1001",
          access: '101201',
        },
        component: () => import('@/hxx-store/car-inspection/inspection-report-statistics.vue')
      },
    ]
  },
  {
    path: '/maintain-server',
    name: 'maintain-server',
    meta: {
      icon: 'logo-buffer',
      title: '维修服务',
      lgType: "1002",
      access: '1001',
    },
    component: Main,
    children:[
      {
        path: '/reservation-list',
        name: 'reservation-list',
        meta: {
          icon: 'md-funnel',
          title: '预约单管理',
          lgType: "1002",
          access: '100101',
        },
        component: () => import('@/hxx-store/maintain-server/reservation-list.vue')
      },
      {
        path: '/take-goods',
        name: 'take-goods',
        meta: {
          icon: 'md-funnel',
          title: '收货管理',
          lgType: "1002",
          // access: '100101',
        },
        component: () => import('@/hxx-store/maintain-server/take-goods.vue')
      },
      {
        path: '/repairOrder-list',
        name: 'repairOrder-list',
        meta: {
          icon: 'md-funnel',
          title: '工单管理',
          lgType: "1002",
          access: '100102',
        },
        component: () => import('@/hxx-store/maintain-server/repairOrder-list.vue')
      },
      {
        path: '/repair-items',
        name: 'repair-items',
        meta: {
          icon: 'md-funnel',
          title: '维修项目',
          lgType: "1002",
          access: '100509',
        },
        component: () => import('@/hxx-store/maintain-server/repair-items.vue')
      },
      {
        path: '/policy-manage',
        name: 'policy-manage',
        meta: {
          icon: 'md-funnel',
          title: '保单管理',
          lgType: "1002",
          access: '100103',
        },
        component: () => import('@/hxx-store/maintain-server/policy-manage.vue')
      },
      {
        path: '/service-combo',
        name: 'service-combo',
        meta: {
          icon: 'md-funnel',
          title: '维修项目套餐',
          lgType: "1002",
          access: '100513',
        },
        component: () => import('@/hxx-store/maintain-server/service-combo.vue')
      },

    ]
},

{
    path: '/parts-manage',
    name: 'parts-manage',
    meta: {
      icon: 'logo-buffer',
      title: '配件管理',
      lgType: "1002",
      access: '1002',
    },
    component: Main,
    children:[
      {
        path: '/parts-purchase',
        name: 'parts-purchase',
        meta: {
          icon: 'md-funnel',
          title: '配件采购',
          lgType: "1002",
          access: '100203',
        },
        component: () => import('@/hxx-store/parts-manage/parts-purchase.vue')
      },
      // {
      //   path: '/my-select',
      //   name: 'my-select',
      //   meta: {
      //     icon: 'md-funnel',
      //     title: '我的选择组件!',
      //     lgType: "1002",
      //     access: '100203',
      //   },
      //   component: () => import('@/hxx-store/parts-manage/my-select.vue')
      // },
      {
        path: '/parts-back',
        name: 'parts-back',
        meta: {
          icon: 'md-funnel',
          title: '采购退货',
          lgType: "1002",
          access: '100207',
        },
        component: () => import('@/hxx-store/parts-manage/parts-back.vue')
      },
      {
        path: '/parts-sell',
        name: 'parts-sell',
        meta: {
          icon: 'md-funnel',
          title: '配件销售',
          lgType: "1002",
          access: '100202',
        },
        component: () => import('@/hxx-store/parts-manage/parts-sell.vue')
      },
      {
        path: '/sales-return',
        name: 'sales-return',
        meta: {
          icon: 'md-funnel',
          title: '销售退货',
          lgType: "1002",
          access: '100206',
        },
        component: () => import('@/hxx-store/parts-manage/sales-return.vue')
      },
      {
        path: '/maintain-pick',
        name: 'maintain-pick',
        meta: {
          icon: 'md-funnel',
          title: '维修领料',
          lgType: "1002",
          access: '100201',
        },
        component: () => import('@/hxx-store/parts-manage/maintain-pick.vue')
      },
      {
        path: '/query-Inventory',
        name: 'query-Inventory',
        meta: {
          icon: 'md-funnel',
          title: '库存查询',
          lgType: "1002",
          access: '100204',
        },
        component: () => import('@/hxx-store/parts-manage/query-Inventory.vue')
      },
      {
        path: '/warehouse-check',
        name: 'warehouse-check',
        meta: {
          icon: 'md-funnel',
          title: '仓库盘点',
          lgType: "1002",
          access: '100205',
        },
        component: () => import('@/hxx-store/parts-manage/warehouse-check.vue')
      },
      {
        path: '/parts-record',
        name: 'parts-record',
        meta: {
          icon: 'md-funnel',
          title: '配件档案',
          lgType: "1002",
          access: '100510',
        },
        component: () => import('@/hxx-store/parts-manage/parts-record.vue')
      },
      {
        path: '/parts-combo',
        name: 'parts-combo',
        meta: {
          icon: 'md-funnel',
          title: '配件套餐',
          lgType: "1002",
          access: '100511',
        },
        component: () => import('@/hxx-store/parts-manage/parts-combo.vue')
      },
    ]
},


{
    path: '/customer-relations',
    name: 'customer-relations',
    meta: {
      icon: 'logo-buffer',
      title: '客户关系',
      lgType: "1002",
      access: '1003',
    },
    component: Main,
    children:[
      {
        path: '/customer-list',
        name: 'customer-list',
        meta: {
          icon: 'md-funnel',
          title: '客户档案',
          lgType: "1002",
          access: '100504',
        },
        component: () => import('@/hxx-store/customer-relations/customer-list.vue')
      },
       {path: '/cart-list',
        name: 'cart-list',
        meta: {
          icon: 'md-funnel',
          title: '车辆档案',
          lgType: "1002",
          access: '100506',
        },
        component: () => import('@/hxx-store/customer-relations/cart-list.vue')
      },
       {path: '/card-product',
        name: 'card-product',
        meta: {
          icon: 'md-funnel',
          title: '储值卡产品管理',
          lgType: "1002",
          access: '100514',
        },
        component: () => import('@/hxx-store/customer-relations/card-product.vue')
      },
       {path: '/card-recharge',
        name: 'card-recharge',
        meta: {
          icon: 'md-funnel',
          title: '储值卡充值',
          lgType: "1002",
          access: '100302',
        },
        component: () => import('@/hxx-store/customer-relations/card-recharge.vue')
      },
      {path: '/card-record',
        name: 'card-record',
        meta: {
          icon: 'md-funnel',
          title: '储值卡消费记录',
          lgType: "1002",
          access: '100303',
        },
        component: () => import('@/hxx-store/customer-relations/card-record.vue')
      }
      // {
      //   path: 'test',
      //   name: 'test',
      //   meta: {
      //     icon: 'md-funnel',
      //     title: '测试',
      //     lgType: "1002",
      //     access: '100101',
      //   },
      //   component: () => import('@/hxx-store/test.vue')
      // },
    ]
},
{
    path: '/finance-manage',
    name: 'finance-manage',
    meta: {
      icon: 'logo-buffer',
      title: '财务管理',
      lgType: "1002",
      access: '1004',
    },
    component: Main,
    children:[
      {
        path: '/invoice-manage',
        name: 'invoice-manage',
        meta: {
          icon: 'md-funnel',
          title: '发票管理',
          lgType: "1002",
          access: '100401',
        },
        component: () => import('@/hxx-store/finance-manage/invoice-manage.vue')
      },
      {
        path: '/expend-income',
        name: 'expend-income',
        meta: {
          icon: 'md-funnel',
          title: '财务收支查询',
          lgType: "1002",
          access: '100402',
        },
        component: () => import('@/hxx-store/finance-manage/expend-income.vue')
      },
    ]
},
  {
    path: '/statistical-reports',
    name: 'statistical-reports',
    meta: {
      icon: 'logo-buffer',
      title: '统计报表',
      lgType: "1002",
      access: '1006',
    },
    component: Main,
    children:[
      {
        path: '/maintenan-statistical',
        name: 'maintenan-statistical',
        meta: {
          icon: 'md-funnel',
          title: '维修班组业绩统计',
          lgType: "1002",
          access: '100605',
        },
        component: () => import('@/hxx-store/statistical-reports/maintenan-statistical.vue')
      },
      {
        path: '/server-statistical',
        name: 'server-statistical',
        meta: {
          icon: 'md-funnel',
          title: '服务顾问业绩统计',
          lgType: "1002",
          access: '100604',
        },
        component: () => import('@/hxx-store/statistical-reports/server-statistical.vue')
      },
      {
        path: '/procurement-statistical',
        name: 'procurement-statistical',
        meta: {
          icon: 'md-funnel',
          title: '采购台账',
          lgType: "1002",
          access: '1009105',
        },
        component: () => import('@/hxx-store/statistical-reports/procurement-statistical.vue')
      },
      {
        path: '/company-revenue',
        name: 'company-revenue',
        meta: {
          icon: 'md-funnel',
          title: '公司营收资金报表',
          lgType: "1002",
          access: '100602',
        },
        component: () => import('@/hxx-store/statistical-reports/company-revenue.vue')
      },
      {
        path: '/business-statistical',
        name: 'business-statistical',
        meta: {
          icon: 'md-funnel',
          title: '业务类别统计',
          lgType: "1002",
          access: '100603',
        },
        component: () => import('@/hxx-store/statistical-reports/business-statistical.vue')
      },

      // {
      //   path: '/company-report',
      //   name: 'company-report',
      //   meta: {
      //     icon: 'md-funnel',
      //     title: '公司经营报告',
      //     lgType: "1002",
      //     access: '100601',
      //   },
      //   component: () => import('@/hxx-store/statistical-reports/company-report.vue')
      // },

    ]
  },
  {
    path: '/base-data',
    name: 'base-data',
    meta: {
      icon: 'logo-buffer',
      title: '基础资料',
      lgType: "1002",
      access: '1005',
    },
    component: Main,
    children:[
      {
        path: '/supplier-profile',
        name: 'supplier-profile',
        meta: {
          icon: 'md-funnel',
          title: '供应商档案',
          lgType: "1002",
          access: '100505',
        },
        component: () => import('@/hxx-store/base-data/supplier-profile.vue')
      },
      {
        path: '/warehouse-manage',
        name: 'warehouse-manage',
        meta: {
          icon: 'md-funnel',
          title: '仓库管理',
          lgType: "1002",
          access: '100507',
        },
        component: () => import('@/hxx-store/base-data/warehouse-manage.vue')
      },
      {
        path: '/insurance-company',
        name: 'insurance-company',
        meta: {
          icon: 'md-funnel',
          title: '保险公司',
          lgType: "1002",
          access: '100508',
        },
        component: () => import('@/hxx-store/base-data/insurance-company.vue')
      }
      ,
      {
        path: '/cart-brand',
        name: 'cart-brand',
        meta: {
          icon: 'md-funnel',
          title: '品牌车型',
          lgType: "1002",
          access: '100503',
        },
        component: () => import('@/hxx-store/base-data/cart-brand.vue')
      },
    ]
  },
  {
    path: '/resource-application',
    name: 'resource-application',
    meta: {
      icon: 'logo-buffer',
      title: '资源申请',
      lgType: "1002",
      access: '1009',
    },
    component: Main,
    children:[
      {
        path: '/recruitment-list',
        name: 'recruitment-list',
        meta: {
          icon: 'md-funnel',
          title: '人员招聘',
          lgType: "1002",
          access: '1009102',
        },
        component: () => import('@/hxx-store/resource-application/recruitment-list.vue')
      },
      {
        path: '/person-training',
        name: 'person-training',
        meta: {
          icon: 'md-funnel',
          title: '人员培训',
          lgType: "1002",
          access: '1009103',
        },
        component: () => import('@/hxx-store/resource-application/person-training.vue')
      },
    ]
  },
  {
    path: '/system-manage',
    name: 'system-manage',
    meta: {
      icon: 'logo-buffer',
      title: '系统管理',
      lgType: "1002",
      access: '1007',
    },
    component: Main,
    children:[
      {
      path: '/account-manage.vue',
      name: 'account-manage',
      meta: {
        icon: 'md-funnel',
        title: '账号管理',
        lgType: "1002",
        access: '100707',
      },
      component: () => import('@/hxx-store/system-manage/account-manage.vue')
    },
      {
        path: '/health-record.vue',
        name: 'health-record',
        meta: {
          icon: 'md-funnel',
          title: '健康档案参数',
          lgType: "1002",
          access: '100704',
        },
        component: () => import('@/hxx-store/system-manage/health-record.vue')
      },
      {
        path: '/store-info',
        name: 'store-info',
        meta: {
          icon: 'md-funnel',
          title: '门店信息',
          lgType: "1002",
          access: '100501',
        },
        component: () => import('@/hxx-store/system-manage/store-info.vue')
      },
      {
        path: '/technical-support',
        name: 'technical-support',
        meta: {
          icon: 'md-funnel',
          title: '技术支持',
          lgType: "1002",
          access: '1009101',
        },
        component: () => import('@/hxx-store/system-manage/technical-support.vue')
      },
      {
        path: '/work-team',
        name: 'work-team',
        meta: {
          icon: 'md-funnel',
          title: '车间班组',
          lgType: "1002",
          access: '100512',
        },
        component: () => import('@/hxx-store/system-manage/work-team.vue')
      },
      {
        path: '/system-parameter',
        name: 'system-parameter',
        meta: {
          icon: 'md-funnel',
          title: '系统参数设置',
          lgType: "1002",
          access: '100705',
        },
        component: () => import('@/hxx-store/system-manage/system-parameter.vue')
      },
      {
        path: '/staff-manage',
        name: '/staff-manage',
        meta: {
          icon: 'md-funnel',
          title: '员工管理',
          lgType: "1002",
          access: '100701',
        },
        component: () => import('@/hxx-store/system-manage/staff-manage.vue')
      },
      {
        path: '/operation-log',
        name: '/operation-log',
        meta: {
          icon: 'md-funnel',
          title: '操作日志',
          lgType: "1002",
          access: '100703',
        },
        component: () => import('@/hxx-store/system-manage/operation-log.vue')
      },
      {
        path: '/health-file',
        name: '/health-file',
        meta: {
          icon: 'md-funnel',
          title: '上传电子健康档案',
          lgType: "1002",
          access: '100706',
        },
        component: () => import('@/hxx-store/system-manage/health-file.vue')
      },
      {
        path: '/operation-description',
        name: 'operation-description',
        meta: {
          icon: 'md-funnel',
          title: '操作指南',
          lgType: "1002",
          access: '100708',
        },
        component: () => import('@/hxx-store/system-manage//operation-description.vue')
      },
    ]
  },

  //⬇好修修-后台管理系统
  {
    path: '/topic-manage',
    name: 'topic-manage',
    meta: {
      icon: 'logo-buffer',
      title: '车谈管理',
      lgType: "1001",
      access: '1010',
    },
    component: Main,
    children:[
      {
        path: '/topic-list',
        name: 'topic-list',
        meta: {
          icon: 'md-funnel',
          title: '话题管理',
          lgType: "1001",
          access: '101001',
        },
        component: () => import('@/hxx-admin/topic-manage/topic-list.vue')
      },
      {
        path: '/topic-circle',
        name: 'topic-circle',
        meta: {
          icon: 'md-funnel',
          title: '话题圈管理',
          lgType: "1001",
          access: '101002',
        },
        component: () => import('@/hxx-admin/topic-manage/topic-circle.vue')
      },
    ]
  },
  {
    path: '/service-staff',
    name: 'service-staff',
    meta: {
      icon: 'logo-buffer',
      title: '服务人员管理',
      lgType: "1001",
      access: '1009',
    },
    component: Main,
    children:[
      {
        path: '/service-staff-list',
        name: 'service-staff-list',
        meta: {
          icon: 'md-funnel',
          title: '服务人员信息',
          lgType: "1001",
          access: '100901',
        },
        component: () => import('@/hxx-admin/service-staff/service-staff-list.vue')
      },
      {
        path: '/daily-count',
        name: 'daily-count',
        meta: {
          icon: 'md-funnel',
          title: '日常服务统计',
          lgType: "1001",
          access: '100902',
        },
        component: () => import('@/hxx-admin/service-staff/daily-count.vue')
      },
      {
        path: '/service-list',
        name: 'service-list',
        meta: {
          icon: 'md-funnel',
          title: '服务明细',
          lgType: "1001",
          access: '100903',
        },
        component: () => import('@/hxx-admin/service-staff/service-list.vue')
      },
      {
        path: '/tast-list',
        name: 'tast-list',
        meta: {
          icon: 'md-funnel',
          title: '任务列表',
          lgType: "1001",
          access: '100904',
        },
        component: () => import('@/hxx-admin/service-staff/tast-list.vue')
      }
    ]
  },
  {
    path: '/manage-store',
    name: 'manage-store',
    meta: {
      icon: 'logo-buffer',
      title: '门店管理',
      lgType: "1001",
      access: '1001',
    },
    component: Main,
    children:[
      {
        path: '/store-info-list',
        name: 'store-info-list',
        meta: {
          icon: 'md-funnel',
          title: '门店信息',
          lgType: "1001",
          access: '100101',
        },
        component: () => import('@/hxx-admin/store-manager/store-info-list.vue')
      },
      {
        path: '/store-check',
        name: 'store-check',
        meta: {
          icon: 'md-funnel',
          title: '门店审核',
          lgType: "1001",
          access: '100102',
        },
        component: () => import('@/hxx-admin/store-manager/store-check.vue')
      },
      {
        path: '/upload-collect',
        name: 'upload-collect',
        meta: {
          icon: 'md-funnel',
          title: '门店上传汇总',
          lgType: "1001",
          access: '100107',
        },
        component: () => import('@/hxx-admin/store-manager/upload-collect.vue')
      },
      {
        path: '/import-store',
        name: 'import-store',
        meta: {
          icon: 'md-funnel',
          title: '批量导入门店',
          lgType: "1001",
          access: '100103',
        },
        component: () => import('@/hxx-admin/store-manager/import-store.vue')
      },
      {
        path: '/sms-inform',
        name: 'sms-inform',
        meta: {
          icon: 'md-funnel',
          title: '短信通知',
          lgType: "1001",
          access: '100104',
        },
        component: () => import('@/hxx-admin/store-manager/sms-inform.vue')
      },
      {
        path: '/upload-error',
        name: 'upload-error',
        meta: {
          icon: 'md-funnel',
          title: '未上传档案',
          lgType: "1001",
          access: '100105',
        },
        component: () => import('@/hxx-admin/store-manager/upload-error.vue')
      },
      {
        path: '/store-img',
        name: 'store-img',
        meta: {
          hideInMenu: true,
          icon: 'md-funnel',
          title: '查看详情',
          lgType: "",
          access: '',
        },
        component: () => import('@/hxx-admin/store-manager/store-img.vue')
      }
    ]
  },
  {
    path: '/member-manage',
    name: 'member-manage',
    meta: {
      icon: 'logo-buffer',
      title: '运营管理',
      lgType: "1001",
      access: '1008',
    },
    component: Main,
    children:[
      {
        path: '/member-list',
        name: 'member-list',
        meta: {
          icon: 'md-funnel',
          title: '会员信息',
          lgType: "1001",
          access: '100801',
        },
        component: () => import('@/hxx-admin/member-manage/member-list.vue')
      },
      {
        path: '/product-list',
        name: 'product-list',
        meta: {
          icon: 'md-funnel',
          title: '产品信息',
          lgType: "1001",
          access: '100802',
        },
        component: () => import('@/hxx-admin/member-manage/product-list.vue')
      },
      {
        path: '/order-list',
        name: 'order-list',
        meta: {
          icon: 'md-funnel',
          title: '订单信息',
          lgType: "1001",
          access: '100803',
        },
        component: () => import('@/hxx-admin/member-manage/order-list.vue')
      },
      {
        path: '/active-list',
        name: 'active-list',
        meta: {
          icon: 'md-funnel',
          title: '内测活动管理',
          lgType: "1001",
          access: '100804',
        },
        component: () => import('@/hxx-admin/member-manage/active-list.vue')
      },
      {
        path: '/manage_etc_userdetail',
        name: 'manage_etc_userdetail',
        meta: {
          icon: 'md-funnel',
          title: 'ETC访问统计',
          lgType: "1001",
          access: '100805',
        },
        component: () => import('@/hxx-admin/etc-manage/manage_etc_userdetail.vue')
      },
      {
        path: '/etc-data',
        name: 'etc-data',
        meta: {
          icon: 'md-funnel',
          title: 'ETC活动数据统计',
          lgType: "1001",
          access: '100806',
        },
        component: () => import('@/hxx-admin/etc-manage/etc-data.vue')
      },
      {
        path: '/active-phone',
        name: 'active-phone',
        meta: {
          icon: 'md-funnel',
          title: '内测手机号管理',
          // lgType: "1001",
          // access: '100804',
        },
        component: () => import('@/hxx-admin/member-manage/active-phone.vue')
      },
    ]
  },
  {
    path: '/discounts-manage',
    name: 'discounts-manage',
    meta: {
      icon: 'logo-buffer',
      title: '优惠券管理',
      lgType: "1001",
      access: '1011',
    },
    component: Main,
    children:[
      {
        path: '/discounts-list',
        name: 'discounts-list',
        meta: {
          icon: 'md-funnel',
          title: '优惠券列表',
          lgType: "1001",
          access: '101101',
        },
        component: () => import('@/hxx-admin/discounts-manage/discounts-list.vue')
      },
      {
        path: '/discounts-record',
        name: 'discounts-record',
        meta: {
          icon: 'md-funnel',
          title: '发放记录',
          lgType: "1001",
          access: '101102',
        },
        component: () => import('@/hxx-admin/discounts-manage/discounts-record.vue')
      },
      {
        path: '/discounts-record-detail',
        name: 'discounts-record-detail',
        meta: {
          icon: 'md-funnel',
          title: '优惠券明细',
          lgType: "1001",
          access: '101103',
          notCache: true
        },
        component: () => import('@/hxx-admin/discounts-manage/discounts-record-detail.vue')
      },
      // {
      //   path: '/activity-trace',
      //   name: 'activity-trace',
      //   meta: {
      //     icon: 'md-funnel',
      //     title: '活动跟踪管理',
      //     // lgType: "1001",
      //     // access: '100801',
      //   },
      //   component: () => import('@/hxx-admin/discounts-manage/activity-trace.vue')
      // },
    ]
  },
  {
    path: '/carInsure-marketing',
    name: 'carInsure-marketing',
    meta: {
      icon: 'logo-buffer',
      title: '车险营销管理',
      lgType: "1001",
      access: '1005',
    },
    component: Main,
    children:[
      {
        path: '/train-claim',
        name: 'train-claim',
        meta: {
          icon: 'md-funnel',
          title: '车险培训认领',
          lgType: "1001",
          access: '100501',
        },
        component: () => import('@/hxx-admin/carInsure-marketing/train-claim.vue')
      },
      {
        path: '/marketing-info',
        name: 'marketing-info',
        meta: {
          icon: 'md-funnel',
          title: '车险营销情况',
          lgType: "1001",
          access: '100502',
        },
        component: () => import('@/hxx-admin/carInsure-marketing/marketing-info.vue')
      },
      {
        path: '/insure-count',
        name: 'insure-count',
        meta: {
          icon: 'md-funnel',
          title: '车险销售总体统计',
          lgType: "1001",
          access: '100503',
        },
        component: () => import('@/hxx-admin/carInsure-marketing/insure-count.vue')
      },
      {
        path: '/company-reports',
        name: 'company-reports',
        meta: {
          icon: 'md-funnel',
          title: '车险营销企业列表',
          lgType: "1001",
          access: '100504',
        },
        component: () => import('@/hxx-admin/carInsure-marketing/company-reports.vue')
      },
      {
        path: '/service-reports',
        name: 'service-reports',
        meta: {
          icon: 'md-funnel',
          title: '车险营销客服报表',
          lgType: "1001",
          access: '100505',
        },
        component: () => import('@/hxx-admin/carInsure-marketing/service-reports.vue')
      },
      {
        path: '/service-detail',
        name: 'service-detail',
        meta: {
          icon: 'md-funnel',
          title: '车险营销客服明细列表',
          lgType: "1001",
          access: '100506',
        },
        component: () => import('@/hxx-admin/carInsure-marketing/service-detail.vue')
      },
      {
        path: '/extract-record',
        name: 'extract-record',
        meta: {
          icon: 'md-funnel',
          title: '提现记录',
          lgType: "1001",
          access: '100506',
        },
        component: () => import('@/hxx-admin/carInsure-marketing/extract-record.vue')
      }
    ]
  },
  {
    path: '/basic-data',
    name: 'basic-data',
    meta: {
      icon: 'logo-buffer',
      title: '基础数据',
      lgType: "1001",
      access: '1002',
    },
    component: Main,
    children:[
      {
        path: '/area-manage',
        name: 'area-manage',
        meta: {
          icon: 'md-funnel',
          title: '行政区域管理',
          lgType: "1001",
          access: '100202',
        },
        component: () => import('@/hxx-admin/basic-data/area-manage.vue')
      },

      {
        path: '/insurance-companyManage',
        name: 'insurance-companyManage',
        meta: {
          icon: 'md-funnel',
          title: '保险公司',
          lgType: "1001",
          access: '100203',
        },
        component: () => import('@/hxx-admin/basic-data/insurance-companyManage.vue')
      },
      {
        path: '/brand-vehicleModel',
        name: 'brand-vehicleModel',
        meta: {
          icon: 'md-funnel',
          title: '品牌车型',
          lgType: "1001",
          access: '100205',
        },
        component: () => import('@/hxx-admin/basic-data/brand-vehicleModel.vue')
      },
      {
        path: '/maintenance-classify',
        name: 'maintenance-classify',
        meta: {
          icon: 'md-funnel',
          title: '维修项目分类',
          lgType: "1001",
          access: '100207',
        },
        component: () => import('@/hxx-admin/basic-data/maintenance-classify.vue')
      },
      {
        path: '/oneTwo-maintain',
        name: 'oneTwo-maintain',
        meta: {
          icon: 'md-funnel',
          title: '一二类维修项目',
          lgType: "1001",
          access: '100204',
        },
        component: () => import('@/hxx-admin/basic-data/oneTwo-maintain.vue')
      },
      {
        path: '/three-maintain',
        name: 'three-maintain',
        meta: {
          icon: 'md-funnel',
          title: '三类维修企业',
          lgType: "1001",
          access: '100405',
        },
        component: () => import('@/hxx-admin/basic-data/three-maintain.vue')
      },
      {
        path: '/parts-classify',
        name: 'parts-classify',
        meta: {
          icon: 'md-funnel',
          title: '配件分类',
          lgType: "1001",
          access: '100206',
        },
        component: () => import('@/hxx-admin/basic-data/parts-classify.vue')
      },
      // {
      //   path: '/my-tree',
      //   name: 'my-tree',
      //   meta: {
      //     icon: 'md-funnel',
      //     title: '我的树',
      //     lgType: "1001",
      //     access: '100405',
      //   },
      //   component: () => import('@/hxx-admin/basic-data/my-tree.vue')
      // },
      {
        path: '/source-manage',
        name: 'source-manage',
        meta: {
          icon: 'md-funnel',
          title: '数据元管理',
          lgType: "1001",
          access: '100201',
        },
        component: () => import('@/hxx-admin/basic-data/source-manage.vue')
      },
      {
        path: '/batch-import',
        name: 'batch-import',
        meta: {
          icon: 'md-funnel',
          title: '配件批量导入',
          lgType: "1001",
          access: '100201',
        },
        component: () => import('@/hxx-admin/basic-data/batch-import.vue')
      }
    ]
  },
  {
    path: '/resources-manage',
    name: 'resources-manage',
    meta: {
      icon: 'logo-buffer',
      title: '资源申请',
      lgType: "1001",
      access: '1003',
    },
    component: Main,
    children:[
      {
        path: '/technical-supportM',
        name: 'technical-supportM',
        meta: {
          icon: 'md-funnel',
          title: '技术支持',
          lgType: "1001",
          access: '100301',
        },
        component: () => import('@/hxx-admin/resources-manage/technical-supportM.vue')
      },
      {
        path: '/person-recruit',
        name: 'person-recruit',
        meta: {
          icon: 'md-funnel',
          title: '人员招聘',
          lgType: "1001",
          access: '100302',
        },
        component: () => import('@/hxx-admin/resources-manage/person-recruit.vue')
      },
      {
        path: '/person-train',
        name: 'person-train',
        meta: {
          icon: 'md-funnel',
          title: '人员培训',
          lgType: "1001",
          access: '100303',
        },
        component: () => import('@/hxx-admin/resources-manage/person-train.vue')
      },
      // {
      //   path: '/user-management',
      //   name: 'user-management',
      //   meta: {
      //     icon: 'md-funnel',
      //     title: '用户管理',
      //     lgType: "1001",
      //     access: '100401',
      //   },
      //   component: () => import('@/hxx-admin/stystem-management/user-management.vue')
      // },
    ]
  },
  {
    path: '/operation-publish',
    name: 'operation-publish',
    meta: {
      icon: 'logo-buffer',
      title: '运营发布',
      lgType: "1001",
      access: '1007',
    },
    component: Main,
    children:[
      {
        path: '/app-version',
        name: 'app-version',
        meta: {
          icon: 'md-funnel',
          title: 'APP版本发布',
          lgType: "1001",
          access: '100701',
        },
        component: () => import('@/hxx-admin/operation-publish/app-version.vue')
      }
    ]
  },
  {
    path: '/stystem-management',
    name: 'stystem-management',
    meta: {
      icon: 'logo-buffer',
      title: '系统管理',
      lgType: "1001",
      access: '1004',
    },
    component: Main,
    children:[
      {
        path: '/user-management',
        name: 'user-management',
        meta: {
          icon: 'md-funnel',
          title: '用户管理',
          lgType: "1001",
          access: '100401',
        },
        component: () => import('@/hxx-admin/stystem-management/user-management.vue')
      },
      {
        path: '/index-roles',
        name: '/index-roles',
        meta: {
          icon: 'md-funnel',
          title: '前台角色管理',
          lgType: "1001",
          access: '100404',
        },
        component: () => import('@/hxx-admin/stystem-management/index-roles.vue')
      },
      {
        path: '/admin-roles',
        name: '/admin-roles',
        meta: {
          icon: 'md-funnel',
          title: '后台角色管理',
          lgType: "1001",
          access: '100402',
        },
        component: () => import('@/hxx-admin/stystem-management/admin-roles.vue')
      },
      {
        path: '/upload-img-manage',
        name: '/upload-img-manage',
        meta: {
          icon: 'md-funnel',
          title: '上传图片管理',
          lgType: "1001",
          access: '100406',
        },
        component: () => import('@/hxx-admin/stystem-management/upload-img-manage.vue')
      },
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
