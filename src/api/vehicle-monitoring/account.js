import request from "@/utils/request";

// 获取资金账户详情
export function getAccountDetail(params) {
  return request({
    url: "/fundAccount/findById",
    method: "get",
    params: params,
  });
}
// 获取资金账户收入支出明细
export function findListByFundAccountId(data) {
  return request({
    url: "/fundAccountDetail/findListByFundAccountId",
    method: "post",
    data: data,
  });
}
// 获取资金账户收入支出明细
export function findAccountBlanceDetailById(params) {
  return request({
    url: "/fundAccountDetail/findById",
    method: "get",
    params: params,
  });
}
