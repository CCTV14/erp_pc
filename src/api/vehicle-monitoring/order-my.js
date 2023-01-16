import request from "@/utils/request";

// 预收单管理
export function myPreCollectOrderFindPageForManage(data) {
  return request({
    url: "/preCollectOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 预收单提交
export function myPreCollectOrderSubmitById(id) {
  return request({
    url: "/preCollectOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 预收单删除
export function deletePreCollectOrder(id) {
  return request({
    url: "/preCollectOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 销售单管理
export function getMySaleOrderData(data) {
  return request({
    url: "/saleOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 销售单提交
export function mySaleOrderSubmitById(id) {
  return request({
    url: "/saleOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 销售单删除
export function deleteSaleorder(id) {
  return request({
    url: "/saleOrder/delete",
    method: "get",
    params: { id: id },
  });
}
// 销售退货单管理
export function getMySaleReturnOrderData(data) {
  return request({
    url: "/saleReturnOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 销售退货单提交
export function mySaleReturnOrderSubmitById(id) {
  return request({
    url: "/saleReturnOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 销售退货单删除
export function deleteSaleReturnorder(id) {
  return request({
    url: "/saleReturnOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 预付单管理
export function myPrePayOrderFindPageForManage(data) {
  return request({
    url: "/prePayOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 预付单提交
export function myPrePayOrderSubmitById(id) {
  return request({
    url: "/prePayOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 预付单删除
export function deletePrePayOrder(id) {
  return request({
    url: "/prePayOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 采购单管理
export function myPurchaseOrderFindPageForManage(data) {
  return request({
    url: "/purchaseOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 采购单提交
export function myPurchaseOrderSubmitById(id) {
  return request({
    url: "/purchaseOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 采购单删除
export function deletePurchaseOrder(id) {
  return request({
    url: "/purchaseOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 采购退货单管理
export function myPurchaseReturnOrderFindPageForManage(data) {
  return request({
    url: "/purchaseReturnOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 采购退货单提交
export function myPurchaseReturnOrderSubmitById(id) {
  return request({
    url: "/purchaseReturnOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 采购退货单删除
export function deletePurchaseReturnOrder(id) {
  return request({
    url: "/purchaseReturnOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 收款单管理
export function myFunCollectOrderFindPageForManage(data) {
  return request({
    url: "/fundCollectOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 收款单提交
export function myFunCollectOrderSubmitById(id) {
  return request({
    url: "/fundCollectOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 收款单删除
export function deleteFunCollectOrder(id) {
  return request({
    url: "/fundCollectOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 付款单管理
export function myFunPayOrderFindPageForManage(data) {
  return request({
    url: "/fundPayOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 付款单提交
export function myFunPayOrderSubmitById(id) {
  return request({
    url: "/fundPayOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 付款单删除
export function deleteFunPayOrder(id) {
  return request({
    url: "/fundPayOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 资金互转单管理
export function myRotationOrderFindPageForManage(data) {
  return request({
    url: "/fundAccountTransferOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 资金互转单提交
export function myRotationOrderSubmitById(id) {
  return request({
    url: "/fundAccountTransferOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 资金互转单删除
export function deleteRotationOrder(id) {
  return request({
    url: "/fundAccountTransferOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 费用支出单管理
export function myExpenseOrderFindPageForManage(data) {
  return request({
    url: "/expenseOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 费用支出单提交
export function myExpenseOrderSubmitById(id) {
  return request({
    url: "/expenseOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 费用支出单删除
export function deleteExpenseOrder(id) {
  return request({
    url: "/expenseOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 其他收入单管理
export function myOtherOrderFindPageForManage(data) {
  return request({
    url: "/otherIncomeOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 其他收入单提交
export function myOtherOrderSubmitById(id) {
  return request({
    url: "/otherIncomeOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 其他收入单删除
export function deleteOtherOrder(id) {
  return request({
    url: "/otherIncomeOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 报损单管理
export function myLossOrderFindPageForManage(data) {
  return request({
    url: "/commodityLossOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 报损单提交
export function myLossOrderSubmitById(id) {
  return request({
    url: "/commodityLossOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 报损单删除
export function deleteLossOrder(id) {
  return request({
    url: "/commodityLossOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 出库单管理
export function myOutOrderFindPageForManage(data) {
  return request({
    url: "/commodityOutputOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 出库单提交
export function myOutOrderSubmitById(id) {
  return request({
    url: "/commodityOutputOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 出库单删除
export function deleteOutOrder(id) {
  return request({
    url: "/commodityOutputOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 入库单管理
export function myInOrderFindPageForManage(data) {
  return request({
    url: "/commodityInputOrder/findPageForCurrentUser",
    method: "post",
    data: data,
  });
}
// 入库单提交
export function myInOrderSubmitById(id) {
  return request({
    url: "/commodityInputOrder/submitById",
    method: "get",
    params: { id: id },
  });
}
// 入库单删除
export function deleteInOrder(id) {
  return request({
    url: "/commodityInputOrder/delete",
    method: "get",
    params: { id: id },
  });
}

// 我配送的入库单
export function getMyInDeliverList(data) {
  return request({
    url: "/commodityInputOrder/findPageForCurrentUserDelivery",
    method: "post",
    data: data,
  });
}

// 我配送的出库单
export function getMyOutDeliverList(data) {
  return request({
    url: "/commodityOutputOrder/findPageForCurrentUserDelivery",
    method: "post",
    data: data,
  });
}
