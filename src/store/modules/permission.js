import { constantRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import store from "../../store";

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    sidebarRouters: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      // 如果不是管理员，不展示系统管理菜单（暂时这么做
      // if (!store.getters.userInfo.isAdmin) {
      //   constantRoutes[constantRoutes.length - 1].hidden = true;
      // }
      state.routes = constantRoutes.concat(routes);
    },
    SET_SIDEBAR_ROUTERS: (state, routers) => {
      // 如果不是管理员，不展示系统管理菜单（暂时这么做
      // if (!store.getters.userInfo.isAdmin) {
      //   constantRoutes[constantRoutes.length - 1].hidden = true;
      // }
      state.sidebarRouters = constantRoutes.concat(routers);
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise((resolve) => {
        // 向后端请求路由数据
        // 死路由的情况下，否则是通过原生路由.concat（接口返回的路由拼到一起）至于404，login，首页都是公共页面，在router.js的constantRoutes（公共路由）有定义
        getRouters().then((res) => {
          // res.data=[res.data[0]];
          const sdata = JSON.parse(JSON.stringify(res.data));
          const rdata = JSON.parse(JSON.stringify(res.data));
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          rewriteRoutes.push({ path: "*", redirect: "/404", hidden: true });
          commit("SET_ROUTES", rewriteRoutes);
          commit("SET_SIDEBAR_ROUTERS", sidebarRoutes);
          resolve(rewriteRoutes);
        });
      });
    },
  },
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
      // route.redirect = "noRedirect";
      route.meta.showRole = true;
      !route.component ? (route.component = "Layout") : "";
    }
    if (route.hidden) {
      route.meta.showRole = false;
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    // console.log(el);
    // el.path = el.path.split("/")[1]; 暂时隐藏，返回path自带/，什么时候做单独路由，再放开
    if (el.children && el.children.length) {
      if (el.component === "ParentView") {
        el.children.forEach((c) => {
          // console.log(c["name"]);
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = (view) => {
  // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve);
};

export default permission;
