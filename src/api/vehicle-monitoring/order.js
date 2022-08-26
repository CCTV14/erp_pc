import request from "@/utils/request";

// 获取我的客户数据
export function getCustomerMyData(data) {
  return request({
    url: "/customerFollowUp/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 销售单 - 管理页面分页查询 - 默认按最近创建排序
export function getSaleOrderData(data) {
    return request({
      url: "/saleOrder/findPageForManage",
      method: "post",
      data: data,
    });
  }
// 枚举 收款进度
export function getFundCollectProgressEnumList() {
  return request({
    url: "/enum/getFundCollectProgressEnumList",
    method: "get",
  });
}
// 枚举  出库进度
export function getCommodityOutputProgressEnumList() {
  return request({
    url: "/enum/getCommodityOutputProgressEnumList",
    method: "get",
  });
}
// 其他收入单and 枚举 单据审批状态
export function getOrderApprovalStatusEnumList() {
  return request({
    url: "/enum/getOrderApprovalStatusEnumList",
    method: "get",
  });
}
