import request from "@/utils/request";

// 获取商品列表
export function getCommodityData(data) {
  return request({
    url: "/commodity/findPageForManage",
    method: "post",
    data: data,
  });
}
// 获取商品列表
export function getCategoryData(data) {
  return request({
    url: "/commodityCategory/findByPage",
    method: "post",
    data: data,
  });
}
// 商品在产状态 枚举
export function getCommodityProductionStatusEnumList() {
  return request({
    url: "/enum/getCommodityProductionStatusEnumList",
    method: "get",
  });
}
// 商品分类清单 (列表)(获取可用的商品分类清单)
export function getCommodityCategoryFindAvailableList() {
  return request({
    url: "/commodityCategory/findAvailableList",
    method: "post",
  });
}
//供应商列表
export function getSupplierData(data) {
  return request({
    url: "/supplier/findPageForManage",
    method: "post",
    data: data
  });
}

