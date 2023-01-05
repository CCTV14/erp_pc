import request from "@/utils/request";

// 获取账户类型-枚举
export function getFundAccountTypeEnumList() {
  return request({
    url: "/enum/getFundAccountTypeEnumList",
    method: "get",
  });
}
// 供应商 详情
export function supplierFindById(params) {
  return request({
    url: "/supplier/findById",
    method: "get",
    params: params,
  });
}
// 供应商 余额变动明细
export function supplierBalanceDetailList(data) {
  return request({
    url: "/supplierBalanceDetail/findPageBySupplier",
    method: "post",
    data: data,
  });
}
// 供应商 余额变动明细 详情
export function supplierBalanDetailFindById(params) {
  return request({
    url: "/supplierBalanceDetail/findById",
    method: "get",
    params: params,
  });
}
