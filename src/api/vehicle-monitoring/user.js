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
