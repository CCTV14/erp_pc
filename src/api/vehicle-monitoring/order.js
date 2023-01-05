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
// 销售单 - 导出
export function saleOrderExport(data) {
  return request({
    url: "/saleOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 销售单 - 详情
export function getSaleOrderDetailById(params) {
  return request({
    url: "/saleOrder/findVoById",
    method: "get",
    params: params,
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
// 枚举 - 付款进度
export function getFundPayProgressEnumList(params) {
  return request({
    url: "/enum/getFundPayProgressEnumList",
    method: "get",
  });
}
// 枚举 - 入库进度
export function getCommodityInputProgressEnumList(params) {
  return request({
    url: "/enum/getCommodityInputProgressEnumList",
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

// 其他收入单  管理页面分页查询  默认按最近创建排序
export function otherIncomeOrderFindPageForManage(data) {
  return request({
    url: "/otherIncomeOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 其他收入单 - 导出
export function otherIncomeOrderExport(data) {
  return request({
    url: "/otherIncomeOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 费用支出单 - 导出
export function expenseOrderExport(data) {
  return request({
    url: "/expenseOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 费用支出单  管理页面分页查询  默认按最近创建排序
export function expenseOrderFindPageForManage(data) {
  return request({
    url: "/expenseOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 资金互转单 - 管理页面分页查询 - 默认按最近创建排序
export function fundAccountTransferOrderFindPageForManage(data) {
  return request({
    url: "/fundAccountTransferOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 资金互转单 - 导出
export function fundAccountTransferOrderExport(data) {
  return request({
    url: "/fundAccountTransferOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 报损单 - 管理页面分页查询 - 默认按最近创建排序
export function commodityLossOrderFindPageForManage(data) {
  return request({
    url: "/commodityLossOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 报损单 - 导出
export function commodityLossOrderExport(data) {
  return request({
    url: "/commodityLossOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 预付单 - 管理页面分页查询 - 默认按最近创建排序
export function prePayOrderFindPageForManage(data) {
  return request({
    url: "/prePayOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 预付单 - 导出
export function prePayOrderExport(data) {
  return request({
    url: "/prePayOrder//exportForManage",
    method: "post",
    data: data,
  });
}
// 预收单 - 管理页面分页查询 - 默认按最近创建排序
export function preCollectOrderFindPageForManage(data) {
  return request({
    url: "/preCollectOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 预收单 - 导出
export function preCollectOrderExport(data) {
  return request({
    url: "/preCollectOrder//exportForManage",
    method: "post",
    data: data,
  });
}
// 采购单 - 管理页面分页查询 - 默认按最近创建排序
export function purchaseOrderFindPageForManage(data) {
  return request({
    url: "/purchaseOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 采购单 - 导出
export function purchaseOrderExport(data) {
  return request({
    url: "/purchaseOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 采购退货单 - 管理页面分页查询 - 默认按最近创建排序
export function purchaseReturnOrderFindPageForManage(data) {
  return request({
    url: "/purchaseReturnOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 采购退货单 - 导出
export function purchaseReturnOrderExport(data) {
  return request({
    url: "/purchaseReturnOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 销售退货单 - 管理页面分页查询 - 默认按最近创建排序
export function saleReturnOrderFindPageForManage(data) {
  return request({
    url: "/saleReturnOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 销售退货单 - 导出
export function saleReturnOrderExport(data) {
  return request({
    url: "/saleReturnOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 入库单 - 管理页面分页查询 - 默认按最近创建排序
export function commodityInputOrderFindPageForManage(data) {
  return request({
    url: "/commodityInputOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 入库单 - 导出
export function commodityInputOrderExport(data) {
  return request({
    url: "/commodityInputOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 出库单 - 管理页面分页查询 - 默认按最近创建排序
export function commodityOutputOrderFindPageForManage(data) {
  return request({
    url: "/commodityOutputOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 出库单 - 导出
export function commodityOutputOrderExport(data) {
  return request({
    url: "/commodityOutputOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 付款单 - 管理页面分页查询 - 默认按最近创建排序
export function fundPayOrderFindPageForManage(data) {
  return request({
    url: "/fundPayOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 付款单 - 导出
export function fundPayOrderExport(data) {
  return request({
    url: "/fundPayOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 收款单 - 管理页面分页查询 - 默认按最近创建排序
export function fundCollectOrderFindPageForManage(data) {
  return request({
    url: "/fundCollectOrder/findPageForManage",
    method: "post",
    data: data,
  });
}
// 收款单 - 导出
export function fundCollectOrderExport(data) {
  return request({
    url: "/fundCollectOrder/exportForManage",
    method: "post",
    data: data,
  });
}
// 枚举 - 出库单类型
export function getCommodityOutputOrderTypeEnumList() {
  return request({
    url: "/enum/getCommodityOutputOrderTypeEnumList",
    method: "get",
  });
}
// 枚举 - 商品配送状态
export function getCommodityDeliverStatusEnumList() {
  return request({
    url: "/enum/getCommodityDeliverStatusEnumList",
    method: "get",
  });
}
// 枚举 - 入库单类型
export function getCommodityInputOrderTypeEnumList() {
  return request({
    url: "/enum/getCommodityInputOrderTypeEnumList",
    method: "get",
  });
}

// 枚举 - 付款单类型
export function getFundPayOrderTypeEnumList() {
  return request({
    url: "/enum/getFundPayOrderTypeEnumList",
    method: "get",
  });
}

// 枚举 - 收款单类型
export function getFundCollectOrderTypeEnumList() {
  return request({
    url: "/enum/getFundCollectOrderTypeEnumList",
    method: "get",
  });
}
