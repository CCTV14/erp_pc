import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error/401"),
    hidden: true,
  },
  {
    path: "",
    component: Layout,
    redirect: "index",
    children: [
      {
        path: "index",
        component: () => import("@/views/index2"),
        name: "Index",
        meta: { title: "首页", icon: "dashboard", affix: true },
      },
    ],
  },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "profile",
        component: () => import("@/views/system/user/profile/index"),
        name: "Profile",
        meta: { title: "个人中心", icon: "user" },
      },
    ],
  },
  {
    path: "/role-auth",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "authUser",
        component: () => import("@/views/system/role/authUser"),
        name: "AuthUser",
        meta: { title: "分配用户" },
      },
    ],
  },
  // {
  //   path: "/vehicle",
  //   component: Layout,
  //   hidden: false,
  //   alwaysShow: true,
  //   redirect: "noRedirect",
  //   meta: { title: "应用", icon: "log" },
  //   children: [
  //     {
  //       path: "pending-order",
  //       hidden: true,
  //       component: () =>
  //         import("@/views/vehicle-monitoring/home/pending-order"),
  //       name: "pending-order",
  //       meta: { title: "待审单据" },
  //     },
  //     {
  //       path: "inventory_warning",
  //       hidden: true,
  //       component: () =>
  //         import("@/views/vehicle-monitoring/home/inventory_warning"),
  //       name: "inventory_warning",
  //       meta: { title: "库存预警" },
  //     },
  //     {
  //       path: "commodity_inout",
  //       hidden: true,
  //       component: () =>
  //         import("@/views/vehicle-monitoring/home/commodity_inout"),
  //       name: "commodity_inout",
  //       meta: { title: "待出入库" },
  //     },
  //     {
  //       path: "sale",
  //       component: () => import("@/views/vehicle-monitoring/orders/sale/index"),
  //       name: "sale",
  //       meta: { title: "销售单管理" },
  //     },
  //     {
  //       path: "sale-detail",
  //       hidden: true,
  //       component: () => import("@/views/vehicle-monitoring/orders/sale/detail"),
  //       name: "sale-detail",
  //       meta: { title: "销售单详情" },
  //     },
  //     // {
  //     //   path: "sale-my",
  //     //   component: () => import("@/views/vehicle-monitoring/orders/sale-my/index"),
  //     //   name: "sale-my",
  //     //   meta: { title: "我的销售退货单" },
  //     // },
  //     {
  //       path: "sale-return",
  //       component: () => import("@/views/vehicle-monitoring/orders/sale-return/index"),
  //       name: "sale-return",
  //       meta: { title: "销售退货单" },
  //     },
  //     {
  //       path: "out",
  //       component: () => import("@/views/vehicle-monitoring/orders/out/index"),
  //       name: "out",
  //       meta: { title: "出库单" },
  //     },
  //     {
  //       path: "in",
  //       component: () => import("@/views/vehicle-monitoring/orders/in/index"),
  //       name: "in",
  //       meta: { title: "入库单" },
  //     },
  //     {
  //       path: "purchase",
  //       component: () => import("@/views/vehicle-monitoring/orders/purchase/index"),
  //       name: "purchase",
  //       meta: { title: "采购单" },
  //     },
  //     {
  //       path: "purchase-return",
  //       component: () => import("@/views/vehicle-monitoring/orders/purchase-return/index"),
  //       name: "purchase-return",
  //       meta: { title: "采购退货单" },
  //     },
  //     {
  //       path: "loss",
  //       component: () => import("@/views/vehicle-monitoring/orders/loss/index"),
  //       name: "loss",
  //       meta: { title: "报损单" },
  //     },
  //     {
  //       path: "funPay",
  //       component: () => import("@/views/vehicle-monitoring/orders/funPay/index"),
  //       name: "funPay",
  //       meta: { title: "付款单" },
  //     },
  //     {
  //       path: "funCollect",
  //       component: () => import("@/views/vehicle-monitoring/orders/funCollect/index"),
  //       name: "funCollect",
  //       meta: { title: "收款单" },
  //     },
  //     {
  //       path: "prePay",
  //       component: () => import("@/views/vehicle-monitoring/orders/prePay/index"),
  //       name: "prePay",
  //       meta: { title: "预付单" },
  //     },
  //     {
  //       path: "preCollect",
  //       component: () => import("@/views/vehicle-monitoring/orders/preCollect/index"),
  //       name: "preCollect",
  //       meta: { title: "预收单" },
  //     },
  //     {
  //       path: "expense",
  //       component: () => import("@/views/vehicle-monitoring/orders/expense/index"),
  //       name: "expense",
  //       meta: { title: "费用支出单" },
  //     },
  //     {
  //       path: "other",
  //       component: () => import("@/views/vehicle-monitoring/orders/other/index"),
  //       name: "other",
  //       meta: { title: "其他收入单" },
  //     },
  //     {
  //       path: "rotation",
  //       component: () => import("@/views/vehicle-monitoring/orders/rotation/index"),
  //       name: "rotation",
  //       meta: { title: "资金互转单" },
  //     },
  //     {
  //       path: "account",
  //       component: () => import("@/views/vehicle-monitoring/account/index"),
  //       name: "account",
  //       meta: { title: "资金账户管理" },
  //     },
  //     {
  //       path: "account-detail",
  //       hidden: true,
  //       component: () => import("@/views/vehicle-monitoring/account/detail"),
  //       name: "account-detail",
  //       meta: { title: "资金账户详情" },
  //     },
  //     {
  //       path: "customer",
  //       component: () => import("@/views/vehicle-monitoring/customer/index"),
  //       name: "customer",
  //       meta: { title: "客户管理" },
  //     },
  //     {
  //       path: "customer-detail",
  //       hidden: true,
  //       component: () => import("@/views/vehicle-monitoring/customer/detail"),
  //       name: "customer-detail",
  //       meta: { title: "客户详情" },
  //     },
  //     {
  //       path: "floow-detail",
  //       hidden: true,
  //       component: () =>
  //         import("@/views/vehicle-monitoring/customer/floowDetail"),
  //       name: "floow-detail",
  //       meta: { title: "客户跟进详情" },
  //     },
  //     {
  //       path: "customer-pool",
  //       component: () =>
  //         import("@/views/vehicle-monitoring/customer-pool/index"),
  //       name: "customer-pool",
  //       meta: { title: "客户公海池" },
  //     },
  //     {
  //       path: "customer-my",
  //       component: () => import("@/views/vehicle-monitoring/customer-my/index"),
  //       name: "customer-my",
  //       meta: { title: "我的客户" },
  //     },
  //     {
  //       path: "floow-record",
  //       component: () =>
  //         import("@/views/vehicle-monitoring/floow-record/index"),
  //       name: "floow-record",
  //       meta: { title: "跟进记录" },
  //     },
  //     {
  //       path: "floow-record-detail",
  //       hidden: true,
  //       component: () =>
  //         import("@/views/vehicle-monitoring/floow-record/detail"),
  //       name: "floow-record-detail",
  //       meta: { title: "跟进记录详情" },
  //     },
  //     {
  //       path: "commodity",
  //       component: () => import("@/views/vehicle-monitoring/commodity/index"),
  //       name: "commodity",
  //       meta: { title: "商品管理" },
  //     },
  //     {
  //       path: "cagetory",
  //       component: () => import("@/views/vehicle-monitoring/cagetory/index"),
  //       name: "cagetory",
  //       meta: { title: "商品分类" },
  //     },
  //     {
  //       path: "supplier",
  //       component: () => import("@/views/vehicle-monitoring/supplier/index"),
  //       name: "supplier",
  //       meta: { title: "供应商管理" },
  //     },
  //     {
  //       path: "supplier-detail",
  //       hidden: true,
  //       component: () => import("@/views/vehicle-monitoring/supplier/detail"),
  //       name: "supplier-detail",
  //       meta: { title: "供应商详情" },
  //     },
  //   ],
  // },
  // {
  //   path: "/rank",
  //   component: Layout,
  //   hidden: false,
  //   alwaysShow: true,
  //   redirect: "noRedirect",
  //   meta: { title: "报表", icon: "tab" },
  //   children: [
  //     {
  //       path: "saleRank",
  //       component: () =>
  //         import("@/views/vehicle-monitoring/report/saleRank/index"),
  //       name: "saleRank",
  //       meta: { title: "销售业绩统计" },
  //     },
  //     {
  //       path: "collectRank",
  //       component: () =>
  //         import("@/views/vehicle-monitoring/report/collectRank/index"),
  //       name: "collectRank",
  //       meta: { title: "回款业绩统计" },
  //     },
  //     {
  //       path: "deliveryRank",
  //       component: () =>
  //         import("@/views/vehicle-monitoring/report/deliveryRank/index"),
  //       name: "deliveryRank",
  //       meta: { title: "配送费统计" },
  //     },
  //     {
  //       path: "supplierRank",
  //       component: () =>
  //         import("@/views/vehicle-monitoring/report/supplierRank/index"),
  //       name: "supplierRank",
  //       meta: { title: "供应商采购统计" },
  //     },
  //     {
  //       path: "commoditySaleRank",
  //       component: () =>
  //         import("@/views/vehicle-monitoring/report/commoditySaleRank/index"),
  //       name: "commoditySaleRank",
  //       meta: { title: "商品销售统计" },
  //     },
  //     {
  //       path: "commodityPurchaseRank",
  //       component: () =>
  //         import(
  //           "@/views/vehicle-monitoring/report/commodityPurchaseRank/index"
  //         ),
  //       name: "commodityPurchaseRank",
  //       meta: { title: "商品采购统计" },
  //     },
  //   ],
  // },
  // {
  //   path: "/setting",
  //   component: Layout,
  //   hidden: false,
  //   alwaysShow: true,
  //   redirect: "noRedirect",
  //   meta: { title: "系统管理", icon: "system" },
  //   children: [
  //     {
  //       path: "user",
  //       component: () => import("@/views/vehicle-monitoring/user/index"),
  //       name: "user",
  //       meta: { title: "用户管理" },
  //     },
  //     {
  //       path: "dept",
  //       component: () => import("@/views/system/dept/index"),
  //       name: "dept",
  //       meta: { title: "组织管理" },
  //     },
  //     {
  //       path: "menu",
  //       component: () => import("@/views/system/menu/index"),
  //       name: "menu",
  //       meta: { title: "菜单管理" },
  //     },
  //     {
  //       path: "set",
  //       component: () => import("@/views/vehicle-monitoring/set/index"),
  //       name: "set",
  //       meta: { title: "设置" },
  //     },
  //   ],
  // },
  // {
  //   path: "/test",
  //   component: Layout,
  //   hidden: false,
  //   alwaysShow: true,
  //   redirect: "noRedirect",
  //   meta: { title: "测试菜单", icon: "system" },
  //   children: [
  //     {
  //       path: "test",
  //       component: () => import("@/views/test/index"),
  //       name: "test",
  //       meta: { title: "测试用", icon: "wechat" },
  //     },
  //   ],
  // },
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [];

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((err) => err);
};

export default new Router({
  mode: "hash", // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});
