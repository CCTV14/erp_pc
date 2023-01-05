import request from "@/utils/request";

// 查询部门列表
export function listDept(data) {
  return request({
    url: "/organization/findAllTree",
    method: "post",
    data: data,
  });
}

// 查询部门可用列表
export function listSelectDept(data) {
  return request({
    url: "/organization/findUnFrozenTree",
    method: "post",
    data: data,
  });
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: "/system/dept/list/exclude/" + deptId,
    method: "get",
  });
}

// 查询部门详细
export function getDept(id) {
  return request({
    url: "/organization/findById",
    method: "get",
    params: { id: id },
  });
}
// 切换冻结状态
export function changeFrozen(id) {
  return request({
    url: "/organization/changeFrozenStatus",
    method: "get",
    params: { id: id },
  });
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: "/organization/findAllTree",
    method: "post",
  });
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: "/system/dept/roleDeptTreeselect/" + roleId,
    method: "get",
  });
}

// 新增部门
export function addDept(data) {
  return request({
    url: "/organization/addNew",
    method: "post",
    data: data,
  });
}

// 修改部门
export function updateDept(data) {
  return request({
    url: "/organization/update",
    method: "post",
    data: data,
  });
}

// 删除部门
export function delDept(id) {
  return request({
    url: "/organization/delete",
    method: "get",
    params: { id: id },
  });
}
