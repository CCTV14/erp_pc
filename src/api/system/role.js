import request from "@/utils/request";

// 查询角色列表
export function listRole(data) {
  return request({
    url: "/sysRole/findByPage",
    method: "post",
    data: data,
  });
}
// 查询角色列表
export function listSelectRole(data) {
  return request({
    url: "/sysRole/findPageForSelect",
    method: "post",
    data: data,
  });
}
// 查询角色列表
export function getRoleByUserId(userId) {
  return request({
    url: "/sysRole/getRoleByUserId",
    method: "get",
    params: { userId: userId },
  });
}
// 查询角色详细
export function getRole(id) {
  return request({
    url: "/sysRole/findById",
    method: "get",
    params: { id: id },
  });
}

// 新增角色
export function addRole(data) {
  return request({
    url: "/sysRole/addNew",
    method: "post",
    data: data,
  });
}

// 修改角色
export function updateRole(data) {
  return request({
    url: "/sysRole/update",
    method: "post",
    data: data,
  });
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: "/system/role/dataScope",
    method: "put",
    data: data,
  });
}
// 切换冻结状态
export function changeFrozen(id) {
  return request({
    url: "/sysRole/changeFrozenStatus",
    method: "get",
    params: { id: id },
  });
}

// 删除角色
export function delRole(id) {
  return request({
    url: "/sysRole/delete",
    method: "get",
    params: { id: id },
  });
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: "/system/role/authUser/allocatedList",
    method: "get",
    params: query,
  });
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: "/system/role/authUser/unallocatedList",
    method: "get",
    params: query,
  });
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: "/sysRole/cancelUserFromRole",
    method: "post",
    data: data,
  });
}

// 批量取消用户授权角色
// export function authUserCancelAll(data) {
//   return request({
//     url: "/system/role/authUser/cancelAll",
//     method: "put",
//     params: data,
//   });
// }

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: "/system/role/authUser/selectAll",
    method: "put",
    params: data,
  });
}

//
// 为用户分配角色
export function roleLeftToRight(data) {
  return request({
    url: "/sysRole/addUserToRole",
    method: "post",
    data: data,
  });
}
// 为用户分配角色
export function roleRightToLeft(data) {
  return request({
    url: "/sysRole/cancelUserFromRole",
    method: "post",
    data: data,
  });
}
// 获取用户分配状态
export function checkDistribute(data) {
  return request({
    url: "/sysRole/checkDistribute",
    method: "post",
    data: data,
  });
}
// 获取可选择用户 左
export function findSelectUser(data) {
  return request({
    url: "/user/findPageForSelect",
    method: "post",
    data: data,
  });
}
// 获取已分配用户 右
export function findRoleUsered(data) {
  return request({
    url: "/sysRole/findRoleUserPage",
    method: "post",
    data: data,
  });
}
