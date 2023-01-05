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
    data: data,
  });
}
// 商品管理 编辑 可选择的供应商
export function changeCanSupplier(data) {
  return request({
    url: "/supplier/findPageForManage",
    method: "post",
    data: data,
  });
}

// 商品分类 新增
export function addCommodityCategory(data) {
  return request({
    url: "/commodityCategory/addNewCategory",
    method: "post",
    data: data,
  });
}
// 商品分类 修改
export function editCommodityCategory(data) {
  return request({
    url: "/commodityCategory/updateCategory",
    method: "post",
    data: data,
  });
}
// 商品分类 详情
export function getCommodityCategoryDetail(params) {
  return request({
    url: "/commodityCategory/findById",
    method: "get",
    params: params,
  });
}
// 商品分类 切换冻结状态
export function changeCommodityCategoryFrozenStatus(params) {
  return request({
    url: "/commodityCategory/changeFrozenStatus",
    method: "get",
    params: params,
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
// 供应商 更新
export function supplierUpdate(data) {
  return request({
    url: "/supplier/updateSupplier",
    method: "post",
    data: data,
  });
}
// 供应商  新增
export function supplierAddSupplier(data) {
  return request({
    url: "/supplier/addNewSupplier",
    method: "post",
    data: data,
  });
}
// 商品导出
export function commodityExport(data) {
  return request({
    url: "/commodity/exportForManage",
    method: "post",
    data: data,
  });
}
