import request from "@/utils/request";

// 查询菜单列表
export function listMenu(data) {
  return request({
    url: "/sysMenu/findAllTree",
    method: "post",
    data: data,
  });
}

// 查询菜单详细
export function getMenu(id) {
  return request({
    url: "/sysMenu/findById",
    method: "get",
    params: { id: id },
  });
}

// 查询菜单下拉树结构 选择用
export function treeselect() {
  return request({
    url: "/sysMenu/findUnFrozenTree",
    method: "post",
  });
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: "/system/menu/roleMenuTreeselect/" + roleId,
    method: "get",
  });
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: "/sysMenu/addNew",
    method: "post",
    data: data,
  });
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: "/sysMenu/update",
    method: "post",
    data: data,
  });
}

// 删除菜单
export function delMenu(id) {
  return request({
    url: "/sysMenu/delete",
    method: "get",
    params: { id: id },
  });
}

// 切换冻结状态
export function changeFrozen(id) {
  return request({
    url: "/sysMenu/changeFrozenStatus",
    method: "get",
    params: { id: id },
  });
}
