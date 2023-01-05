import request from "@/utils/request";

// 获取账户类型-枚举
export function getFundAccountTypeEnumList() {
  return request({
    url: "/enum/getFundAccountTypeEnumList",
    method: "get",
  });
}
// 资金账户页面查询
export function getAccountData(data) {
  return request({
    url: "/fundAccount/findPageForManage",
    method: "post",
    data: data,
  });
}
// 用户类型-枚举
export function getUserTypeEnumListSync() {
  return request({
    url: "/enum/getUserTypeEnumList",
    method: "get",
  });
}
// 用户列表
export function getUserList(data) {
  return request({
    url: "/user/findPageForUserManage",
    method: "post",
    data: data,
  });
}

// 新增账户
export function addAccount(data) {
  return request({
    url: "/fundAccount/addNewFundAccount",
    method: "post",
    data: data,
  });
}
// 修改账户
export function editAccount(data) {
  return request({
    url: "/fundAccount/updateFundAccount",
    method: "post",
    data: data,
  });
}
// 获取资金用户详情
export function getAccountDetail(params) {
  return request({
    url: "/fundAccount/findById",
    method: "get",
    params: params,
  });
}
//
// 新增用户
export function addUser(data) {
  return request({
    url: "/user/addNewUser",
    method: "post",
    data: data,
  });
}
// 编辑用户
export function updateUser(data) {
  return request({
    url: "/user/updateUser",
    method: "post",
    data: data,
  });
}
// 用户详情
export function getUser(id) {
  return request({
    url: "/user/findById",
    method: "get",
    params: { id: id },
  });
}
// 切换冻结状态
export function changeFrozen(id) {
  return request({
    url: "/user/changeFrozenStatus",
    method: "get",
    params: { id: id },
  });
}
// 重置密码
export function resetPassword(targetUserId) {
  return request({
    url: "/user/resetPassword",
    method: "get",
    params: { targetUserId: targetUserId },
  });
}
