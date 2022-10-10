import request from '@/utils/request'

// 获取首页销售数据
export function getSaleData(data) {
  return request({
    url: '/dynamicKanban/getSaleData',
    method: 'post',
    data: data
  })
}
// 获取销售排行数据
export function getSaleRankInfo(data) {
  return request({
    url: '/dynamicKanban/getSaleRank',
    method: 'post',
    data: data
  })
}
// 获取回款排行数据
export function getColletRankInfo(data) {
  return request({
    url: '/dynamicKanban/getCollectRank',
    method: 'post',
    data: data
  })
}
// 获取库存预警数据
export function getInventoryWarningData() {
  return request({
    url: '/dynamicKanban/getCommoditySpecQuantityWarningCount',
    method: 'get'
  })
}

// 获取待审单据数量
export function dynamicKanbanGetPendingOrderCount() {
  return request({
    url: '/dynamicKanban/getPendingOrderCount',
    method: 'get'
  })
}
// 获取商品出入库数量
export function dynamicKanbanGetCommodityInOutQuantity() {
  return request({
    url: '/dynamicKanban/getCommodityInOutQuantity',
    method: 'get'
  })
}
// 获取待处理客户跟进数量异常
export function dynamicKanbanGetFollowUpCount() {
  return request({
    url: '/dynamicKanban/getFollowUpCount',
    method: 'get'
  })
}
// 获取库存预警的商品数量
export function dynamicKanbanGetCommoditySpecQuantityWarningCount() {
  return request({
    url: '/dynamicKanban/getCommoditySpecQuantityWarningCount',
    method: 'get'
  })
}
