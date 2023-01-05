import request from "@/utils/request";

// 获取销售业绩统计看板数据 报表
export function getSaleRank(data) {
  return request({
    url: "/dynamicKanban/getSaleRank",
    method: "post",
    data: data,
  });
}

// 获取回款统计看板数据 报表
export function getCollectRank(data) {
  return request({
    url: "/dynamicKanban/getCollectRank",
    method: "post",
    data: data,
  });
}
// 获取配送费统计看板数据 报表
export function getDeliveryRank(data) {
  return request({
    url: "/dynamicKanban/distributeFeeReport",
    method: "post",
    data: data,
  });
}
// 报表 - 获取供应商采购报表
export function getSupplierRank(data) {
  return request({
    url: "/dynamicKanban/supplierPurchaseReport",
    method: "post",
    data: data,
  });
}
// 报表 - 获取商品销售报表
export function getCommoditySaleReport(data) {
  return request({
    url: "/dynamicKanban/commoditySaleReport",
    method: "post",
    data: data,
  });
}
// 报表 - 获取商品采购报表
export function getCommodityPurchaseReport(data) {
  return request({
    url: "/dynamicKanban/commodityPurchaseReport",
    method: "post",
    data: data,
  });
}
// 商品分类清单 (列表)(获取可用的商品分类清单)
export function getCommodityCategoryFindAvailableList() {
  return request({
    url: "/commodityCategory/findAvailableList",
    method: "post",
  });
}

