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
  {
    path: '/components',
    name: 'components',
    meta: {
      icon: 'logo-buffer',
      title: '测试'
    },
    component: Main,
    children: [
  //     {
  //       path: 'count_to_page',
  //       name: 'count_to_page',
  //       meta: {
  //         icon: 'md-trending-up',
  //         title: '数字渐变'
  //       },
  //       component: () => import('@/view/components/count-to/count-to.vue')
  //     },
      {
        path: 'tables_page',
        name: 'tables_page',
        meta: {
          icon: 'md-grid',
          title: '多功能表格'
        },
        component: () => import('@/view/components/tables/tables.vue')
      },
      {
        path: 'test',
        name: 'test',
        meta: {
          icon: 'md-funnel',
          title: '测试',
        },
        component: () => import('@/hxx-store/test.vue')
      },
  //     {
  //       path: 'split_pane_page',
  //       name: 'split_pane_page',
  //       meta: {
  //         icon: 'md-pause',
  //         title: '分割窗口'
  //       },
  //       component: () => import('@/view/components/split-pane/split-pane.vue')
  //     },
  //     {
  //       path: 'markdown_page',
  //       name: 'markdown_page',
  //       meta: {
  //         icon: 'logo-markdown',
  //         title: 'Markdown编辑器'
  //       },
  //       component: () => import('@/view/components/markdown/markdown.vue')
  //     },
  //     {
  //       path: 'editor_page',
  //       name: 'editor_page',
  //       meta: {
  //         icon: 'ios-create',
  //         title: '富文本编辑器'
  //       },
  //       component: () => import('@/view/components/editor/editor.vue')
  //     },
  //     {
  //       path: 'icons_page',
  //       name: 'icons_page',
  //       meta: {
  //         icon: '_bear',
  //         title: '自定义图标'
  //       },
  //       component: () => import('@/view/components/icons/icons.vue')
  //     }
    ]
  },
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
    ]
  },

  //⬇好修修-后台管理系统⬇
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
        path: '/manage-store-info',
        name: 'manage-store-info',
        meta: {
          icon: 'md-funnel',
          title: '门店信息',
          lgType: "1001",
          access: '100101',
        },
        component: () => import('@/hxx-admin/store-manager/store-info-list.vue')
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
